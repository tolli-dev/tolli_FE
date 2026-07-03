import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from '@/firebase/fireAuth';

// 회원가입/대시보드 어느 경로에서 호출되든 동작하도록 Firebase idToken으로 인증한다.
// (회원가입 중 알람 설정 화면에는 아직 __session 쿠키가 없기 때문)
async function getIdToken(): Promise<string | null> {
  if (fireAuth.currentUser) {
    return fireAuth.currentUser.getIdToken().catch(() => null);
  }
  return new Promise<string | null>((resolve) => {
    const unsub = onAuthStateChanged(fireAuth, (user) => {
      unsub();
      if (user) user.getIdToken().then(resolve).catch(() => resolve(null));
      else resolve(null);
    });
  });
}

export type AlarmSetting = {
  enabled: boolean;
  hour: number | null;
  minute: number | null;
};

// 현재 알람 설정 조회. 인증 실패 시 null.
export async function getAlarm(): Promise<AlarmSetting | null> {
  const idToken = await getIdToken();
  if (!idToken) return null;
  const res = await fetch('/api/alarm', {
    headers: { Authorization: `Bearer ${idToken}` },
  }).catch(() => null);
  if (!res || !res.ok) return null;
  return res.json().catch(() => null);
}

// 알람 시간 저장(+켜기). 성공 여부 반환.
export async function saveAlarm(hour: number, minute: number): Promise<boolean> {
  const idToken = await getIdToken();
  if (!idToken) return false;
  const res = await fetch('/api/alarm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, hour, minute }),
  }).catch(() => null);
  return !!res && res.ok;
}

// 알람 켜기/끄기. 켜는데 저장된 시간이 없으면 { needsTime: true }.
export async function setAlarmEnabled(
  enabled: boolean,
): Promise<{ ok: boolean; needsTime?: boolean }> {
  const idToken = await getIdToken();
  if (!idToken) return { ok: false };
  const res = await fetch('/api/alarm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, enabled }),
  }).catch(() => null);
  if (!res) return { ok: false };
  return res.json().catch(() => ({ ok: false }));
}
