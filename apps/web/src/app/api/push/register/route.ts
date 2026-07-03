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
