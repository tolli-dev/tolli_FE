import { cookies } from "next/headers";
import admin from "@/firebase/firebaseAdmin";
import DashboardClient from "./_components/DashboardClient";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardLayout from "./_components/DashboardLayout";
import { pool } from "@/lib/db";

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

async function fetchDashboardData(userId: string): Promise<DashboardInitialData> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [userResult, verseResult] = await Promise.all([
    pool.query<{ nickname: string }>(
      'SELECT nickname FROM users WHERE id = $1',
      [userId]
    ),
    pool.query<{ id: number; reference: string; full_text: string }>(
      `SELECT v.id, v.reference, v.full_text
       FROM study_completions sc
       JOIN verses v ON sc.verse_id = v.id
       WHERE sc.user_id = $1 AND sc.completed_at >= $2
       LIMIT 1`,
      [userId, today.toISOString()]
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
  const nickname = initialData?.nickname ?? "";

  return (
    <DashboardLayout done={done}>
      <div className="relative w-full h-[clamp(1.125rem,5vw,1.5rem)] shrink-0 mb-[clamp(0.5rem,2vw,0.75rem)]">
        <DashboardHeader nickname={nickname} done={done} />
      </div>
      <DashboardClient
        initialData={initialData}
        shouldRefreshSession={!!userId}
      />
    </DashboardLayout>
  );
}
