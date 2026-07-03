import { NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/firebaseAdmin';
import { pool } from '@/lib/db';

// 알람 설정 API. 회원가입 중 알람 설정 화면에서는 아직 __session 쿠키가 없으므로
// (register는 쿠키를 만들지 않음) 쿠키 대신 Firebase idToken으로 인증한다.
async function getUidFromIdToken(idToken: string | null | undefined): Promise<string | null> {
  if (!idToken) return null;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}

// GET /api/alarm  (Authorization: Bearer <idToken>)
// 현재 알람 설정 조회 → { enabled, hour, minute }
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const uid = await getUidFromIdToken(idToken);
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const { rows } = await pool.query<{ hour: number; minute: number; enabled: boolean }>(
      'SELECT hour, minute, enabled FROM alarm_settings WHERE user_id = $1',
      [uid],
    );
    const row = rows[0];
    return NextResponse.json({
      enabled: row?.enabled ?? false,
      hour: row?.hour ?? null,
      minute: row?.minute ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
}

// POST /api/alarm  body: { idToken, hour?, minute?, enabled? }
// - hour/minute 있으면: 시간 저장 + enabled=true (오늘 다시 울릴 수 있게 last_sent_on 초기화)
// - enabled:true 만 있으면: 기존 시간으로 다시 켜기 (시간 없으면 needsTime)
// - enabled:false 면: 끄기
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'bad request' }, { status: 400 });

  const uid = await getUidFromIdToken(body.idToken);
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    if (typeof body.hour === 'number' && typeof body.minute === 'number') {
      if (body.hour < 0 || body.hour > 23 || body.minute < 0 || body.minute > 59) {
        return NextResponse.json({ error: 'invalid time' }, { status: 400 });
      }
      await pool.query(
        `INSERT INTO alarm_settings (user_id, hour, minute, enabled, last_sent_on, updated_at)
         VALUES ($1, $2, $3, true, NULL, now())
         ON CONFLICT (user_id)
         DO UPDATE SET hour = EXCLUDED.hour, minute = EXCLUDED.minute,
                       enabled = true, last_sent_on = NULL, updated_at = now()`,
        [uid, body.hour, body.minute],
      );
      return NextResponse.json({ ok: true });
    }

    if (body.enabled === true) {
      // 기존 시간이 있어야 켤 수 있다. 없으면 시간 설정 화면으로 유도.
      const { rowCount } = await pool.query(
        'UPDATE alarm_settings SET enabled = true, updated_at = now() WHERE user_id = $1',
        [uid],
      );
      if (rowCount === 0) return NextResponse.json({ ok: false, needsTime: true });
      return NextResponse.json({ ok: true });
    }

    if (body.enabled === false) {
      await pool.query(
        'UPDATE alarm_settings SET enabled = false, updated_at = now() WHERE user_id = $1',
        [uid],
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
}
