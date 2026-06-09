import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { createPrivateKey } from 'crypto';

async function generateClientSecret(): Promise<string> {
  const privateKey = createPrivateKey(
    process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  );

  return new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: process.env.APPLE_KEY_ID })
    .setIssuer(process.env.APPLE_TEAM_ID!)
    .setAudience('https://appleid.apple.com')
    .setSubject('com.web.tolli')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const code = formData.get('code') as string | null;
  const idToken = formData.get('id_token') as string | null;

  if (!code && !idToken) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 });
  }

  if (idToken) {
    return NextResponse.redirect(
      `tolli://auth/apple/callback?id_token=${encodeURIComponent(idToken)}`,
    );
  }

  const clientSecret = await generateClientSecret();

  const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: 'com.web.tolli',
      client_secret: clientSecret,
      code: code ?? '',
      grant_type: 'authorization_code',
      redirect_uri: 'https://tolli-fe-web.vercel.app/api/auth/apple/callback',
    }),
  });

  const tokenData = await tokenRes.json();
  const exchangedIdToken = tokenData.id_token as string | undefined;

  if (!exchangedIdToken) {
    return NextResponse.json({ error: 'token exchange failed', detail: tokenData }, { status: 400 });
  }

  return NextResponse.redirect(
    `tolli://auth/apple/callback?id_token=${encodeURIComponent(exchangedIdToken)}`,
  );
}
