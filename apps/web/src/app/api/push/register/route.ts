import { NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/firebaseAdmin';
import { pool } from '@/lib/db';

async function getUserId(request: NextRequest): Promise<string | null> {
  const sessionCookie = request.cookies.get('__session')?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { token, platform } = await request.json();
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'token required' }, { status: 400 });
  }

  try {
    // 푸시 토큰은 기기(설치) 단위로 유일하다. 한 기기에서 다른 계정으로
    // 로그인했다 전환하면 옛 계정 밑에 같은 토큰이 남아, 그 계정이 미완료면
    // 고정 알림이 이 기기로 발송된다(완료했는데 알림 오는 버그).
    // 등록 시 이 토큰을 현재 유저에게 독점 귀속시켜 유령 계정의 토큰을 정리한다.
    await pool.query('DELETE FROM push_tokens WHERE token = $1 AND user_id <> $2', [
      token,
      userId,
    ]);
    await pool.query(
      `INSERT INTO push_tokens (user_id, token, platform, updated_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id, token)
       DO UPDATE SET platform = EXCLUDED.platform, updated_at = now()`,
      [userId, token, platform ?? null],
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
}
