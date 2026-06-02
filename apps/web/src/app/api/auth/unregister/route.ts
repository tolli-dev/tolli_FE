import { NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (!idToken) return NextResponse.json({ error: 'idToken required' }, { status: 400 });

  const decoded = await admin.auth().verifyIdToken(idToken);
  await admin.auth().setCustomUserClaims(decoded.uid, { registered: false });
  return NextResponse.json({ ok: true });
}
