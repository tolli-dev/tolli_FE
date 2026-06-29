import { NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (!idToken) return NextResponse.json({ error: 'idToken required' }, { status: 400 });

  try {
    const expiresIn = 14 * 24 * 60 * 60 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ ok: true });
    response.cookies.set('__session', sessionCookie, {
      maxAge: 14 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
