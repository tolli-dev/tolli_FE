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

  const { token } = await request.json().catch(() => ({ token: null }));

  try {
    if (token) {
      await pool.query('DELETE FROM push_tokens WHERE user_id = $1 AND token = $2', [userId, token]);
    } else {
      await pool.query('DELETE FROM push_tokens WHERE user_id = $1', [userId]);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
}
