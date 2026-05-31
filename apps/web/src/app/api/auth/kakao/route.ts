import { NextRequest, NextResponse } from 'next/server'
import admin from '@/firebase/firebaseAdmin'

export async function POST(request: NextRequest) {
  const { kakaoUid } = await request.json()

  if (!kakaoUid) {
    return NextResponse.json({ error: 'kakaoUid is required' }, { status: 400 })
  }

  const customToken = await admin.auth().createCustomToken(`kakao:${kakaoUid}`)

  return NextResponse.json({ customToken })
}
