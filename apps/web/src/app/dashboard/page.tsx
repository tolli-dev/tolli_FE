import { cookies } from "next/headers";
import admin from "@/firebase/firebaseAdmin";
import DashboardClient from "./_components/DashboardClient";
import DashboardLayout from "./_components/DashboardLayout";
import { pool } from "@/lib/db";
import { getLocalMidnight } from "@/lib/date";

export type TodayVerse = {
  id: number;
  reference: string;
  fullText: string;
} | null;

export type DashboardInitialData = {
  nickname: string;
  todayVerse: TodayVerse;
  done: boolean;
} | null;

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

async function fetchDashboardData(
  userId: string,
): Promise<DashboardInitialData> {
  const cookieStore = await cookies();
  const tzCookie = cookieStore.get("user-timezone")?.value;
  const today = getLocalMidnight(tzCookie || "Asia/Seoul");

  const [userResult, verseResult] = await Promise.all([
    pool.query<{ nickname: string }>(
      "SELECT nickname FROM users WHERE id = $1",
      [userId],
    ),
    pool.query<{ id: number; reference: string; full_text: string }>(
      `SELECT v.id, v.reference, v.full_text
       FROM study_completions sc
       JOIN verses v ON sc.verse_id = v.id
       WHERE sc.user_id = $1 AND sc.completed_at >= $2
       LIMIT 1`,
      [userId, today.toISOString()],
    ),
  ]);

  const nickname = userResult.rows[0]?.nickname ?? "";
  const row = verseResult.rows[0] ?? null;
  const todayVerse = row
    ? { id: row.id, reference: row.reference, fullText: row.full_text }
    : null;

  return { nickname, todayVerse, done: todayVerse !== null };
}

export default async function DashBoard() {
  const userId = await getUserId();
  const initialData = userId ? await fetchDashboardData(userId) : null;
  const done = initialData?.done ?? false;

  return (
    <DashboardLayout done={done}>
      <DashboardClient
        initialData={initialData}
        shouldRefreshSession={!!userId}
      />
    </DashboardLayout>
  );
}
