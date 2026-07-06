import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getLocalMidnight } from "@/lib/date";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// 사용자가 설정한 알람 시각에 도달했으나 놓쳤을 수 있으므로, 최근 5분 창을 함께 본다.
// last_sent_on(오늘 발송 여부)으로 중복 발송을 막기 때문에 창이 넓어도 안전하다.
const WINDOW_MINUTES = 4;

type ExpoMessage = {
  to: string;
  title: string;
  body: string;
  sound: "default";
  channelId: "default";
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// 한국 시간 기준 현재 시/분/날짜(YYYY-MM-DD) 계산
function getSeoulNow(): { minutes: number; dateStr: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date());

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const hour = parseInt(get("hour"), 10) % 24; // en-CA에서 24시가 나올 수 있어 보정
  const minute = parseInt(get("minute"), 10);
  const dateStr = `${get("year")}-${get("month")}-${get("day")}`;
  return { minutes: hour * 60 + minute, dateStr };
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const authorized =
    !!secret && (authHeader === `Bearer ${secret}` || querySecret === secret);
  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { minutes: nowMinutes, dateStr } = getSeoulNow();
  const todayMidnight = getLocalMidnight("Asia/Seoul");

  // 발송 대상을 원자적으로 "선점"한다: last_sent_on을 오늘로 올리면서 대상 user_id를 반환.
  // 크론이 겹쳐 실행돼도 IS DISTINCT FROM 조건 때문에 한 번만 선점된다(중복 발송 방지).
  const { rows: claimed } = await pool.query<{ user_id: string }>(
    `UPDATE alarm_settings a
        SET last_sent_on = $1::date
      WHERE a.enabled = true
        AND a.last_sent_on IS DISTINCT FROM $1::date
        AND (a.hour * 60 + a.minute) >= $2
        AND (a.hour * 60 + a.minute) <= $3
        AND a.user_id NOT IN (
          SELECT user_id FROM study_completions WHERE completed_at >= $4
        )
      RETURNING a.user_id`,
    [
      dateStr,
      nowMinutes - WINDOW_MINUTES,
      nowMinutes,
      todayMidnight.toISOString(),
    ],
  );

  if (claimed.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const userIds = claimed.map((r) => r.user_id);
  const { rows: tokenRows } = await pool.query<{ token: string }>(
    "SELECT DISTINCT token FROM push_tokens WHERE user_id = ANY($1)",
    [userIds],
  );

  const tokens = tokenRows
    .map((r) => r.token)
    .filter((t) => t.startsWith("ExponentPushToken"));
  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, claimed: userIds.length });
  }

  const messages: ExpoMessage[] = tokens.map((to) => ({
    to,
    title: "오늘의 말씀 🐘",
    body: "톨리와 약속한 말씀 암송 시간이에요!",
    sound: "default",
    channelId: "default",
  }));

  const invalidTokens: string[] = [];
  let sent = 0;

  for (const batch of chunk(messages, 100)) {
    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(batch),
    });
    const json = await res.json().catch(() => null);
    const tickets: Array<{ status: string; details?: { error?: string } }> =
      json?.data ?? [];
    tickets.forEach((ticket, i) => {
      if (ticket.status === "ok") {
        sent += 1;
      } else if (ticket.details?.error === "DeviceNotRegistered") {
        invalidTokens.push(batch[i].to);
      }
    });
  }

  if (invalidTokens.length > 0) {
    await pool.query("DELETE FROM push_tokens WHERE token = ANY($1)", [
      invalidTokens,
    ]);
  }

  return NextResponse.json({
    ok: true,
    sent,
    claimed: userIds.length,
    removed: invalidTokens.length,
  });
}
