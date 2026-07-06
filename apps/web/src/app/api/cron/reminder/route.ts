import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getLocalMidnight } from "@/lib/date";

// 슬롯별 알림 문구 (네이티브 로컬 알림과 동일 톤)
const MESSAGES: Record<string, string> = {
  "12": "톨리 배고파요 🌿 말씀의 양식을 채워주세요.",
  "18": "아직 배가 고파요 😢 오늘 말씀이 아직 남아있어요.",
  "22": "오늘 말씀, 자기 전에 꼭 채우고 자요 🌙",
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

type ExpoMessage = {
  to: string;
  title: string;
  body: string;
  sound: "default";
  channelId: "default";
  data: { isFixedAlarm: true };
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function GET(request: NextRequest) {
  // 인증: Vercel Cron은 Authorization: Bearer ${CRON_SECRET} 헤더를 전송
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const authorized =
    !!secret && (authHeader === `Bearer ${secret}` || querySecret === secret);
  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const slot = request.nextUrl.searchParams.get("slot") ?? "12";
  const body = MESSAGES[slot];
  if (!body) {
    return NextResponse.json({ error: "invalid slot" }, { status: 400 });
  }

  // 오늘(한국 시간) 말씀을 완료하지 않은 사용자의 토큰만 조회
  const today = getLocalMidnight("Asia/Seoul");
  const { rows } = await pool.query<{ token: string }>(
    `SELECT DISTINCT pt.token
       FROM push_tokens pt
      WHERE pt.user_id NOT IN (
        SELECT user_id FROM study_completions WHERE completed_at >= $1
      )`,
    [today.toISOString()],
  );

  const tokens = rows
    .map((r) => r.token)
    .filter((t) => t.startsWith("ExponentPushToken"));
  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const messages: ExpoMessage[] = tokens.map((to) => ({
    to,
    title: "톨리",
    body,
    sound: "default",
    channelId: "default",
    data: { isFixedAlarm: true },
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

  // 만료된 토큰 정리
  if (invalidTokens.length > 0) {
    await pool.query("DELETE FROM push_tokens WHERE token = ANY($1)", [
      invalidTokens,
    ]);
  }

  return NextResponse.json({ ok: true, sent, removed: invalidTokens.length });
}
