# 알림 개선 작업 정리 (branch: `refactor/alarm`)

> 2026-07-02 오전 작업 전체 기록. 코드 수정 사항 + 개념 설명.
> 목표: "오늘 말씀을 완료하지 않은 사용자에게만" 정해진 시간(12/18/22시)에 알림을 보내되,
> 사용자가 직접 설정한 알람은 그대로 유지한다.

---

## 목차
1. [배경: 알림이 두 종류다](#1-배경-알림이-두-종류다)
2. [문제 A — 알람 시간 피커가 튀는 버그](#2-문제-a--알람-시간-피커가-튀는-버그)
3. [문제 B — 고정 알림이 안 오고, 로컬 알림의 근본 한계](#3-문제-b--고정-알림이-안-오고-로컬-알림의-근본-한계)
4. [안드로이드 알림 권한 & 배터리 최적화 개념](#4-안드로이드-알림-권한--배터리-최적화-개념)
5. [해결책 — 서버 푸시(Expo Push)로 전환](#5-해결책--서버-푸시expo-push로-전환)
6. [FirebaseApp 초기화 문제 & gradle 수동 설정](#6-firebaseapp-초기화-문제--gradle-수동-설정)
7. [iOS(APNs)](#7-iosapns)
8. [용어 정리](#8-용어-정리)
9. [전체 변경 파일 목록](#9-전체-변경-파일-목록)
10. [남은 작업 체크리스트](#10-남은-작업-체크리스트)

---

## 1. 배경: 알림이 두 종류다

이번 작업의 핵심은 **알림을 두 종류로 명확히 나눈 것**이다.

| 종류 | 발송 주체 | 시점 | 완료자 필터 |
|------|-----------|------|-------------|
| **사용자 알람** | 기기(로컬) | 사용자가 설정한 시간 | 없음 (항상 옴) |
| **고정 리마인더** | 서버(Expo Push) | 12:00 / 18:00 / 22:00 | 있음 (미완료자만) |

처음엔 둘 다 기기 로컬 알림(`expo-notifications`의 `DAILY` 트리거)으로 구현했었다.
하지만 "완료자에게는 보내지 않기"가 로컬 방식으로는 불가능해서(→ 3장) 고정 리마인더만
**서버 푸시로 옮겼다**.

---

## 2. 문제 A — 알람 시간 피커가 튀는 버그

### 증상
사용자가 알람 설정 화면에 들어가면 저장했던 시간이 잠깐 보였다가,
조금만 스크롤하면 기본값(오전 7시)으로 튀어버렸다.

### 원인 (핵심 학습 포인트)
`WheelPicker.tsx`의 스크롤 위치 초기화 `useEffect`가 **빈 의존성 배열 `[]`**이었다.

```tsx
// 문제 코드
useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;
  el.scrollTop = selectedIndex * SNAP_HEIGHT;
}, []); // ← 마운트 시 딱 한 번만 실행됨
```

`useEffect(..., [])`는 **컴포넌트가 처음 마운트될 때 딱 한 번만** 실행된다.
- 마운트 시점엔 `selectedIndex`가 아직 기본값(6 = 7시)이다.
- 그래서 스크롤 컨테이너는 7시 위치에 고정된다.
- 이후 네이티브에서 저장된 시간(`ALARM_TIME`)이 도착해 `selectedIndex`가 바뀌면,
  **화면에 보이는 숫자(items)는 CSS transition으로 새 위치로 움직이지만**,
  **스크롤 컨테이너 자체는 여전히 7시 위치**에 있다.
- 사용자가 스크롤하는 순간 `onScroll`이 컨테이너의 실제 위치(7시)를 읽어서 7시로 되돌린다.

즉 **"보이는 것"과 "실제 스크롤 위치"가 어긋나 있던 것**이 원인.

### 해결
의존성 배열에 `selectedIndex`를 넣어서, prop이 바뀔 때마다 스크롤 위치를 다시 맞춘다.
단, 사용자가 드래그 중일 때는 방해하면 안 되므로 `isDragging` 가드를 추가한다.

```tsx
// 수정 코드 — apps/web/src/app/signup/set-alarm-time/_components/WheelPicker.tsx
useEffect(() => {
  const el = scrollRef.current;
  if (!el || isDragging.current) return; // 드래그 중엔 건드리지 않음
  el.scrollTop = selectedIndex * SNAP_HEIGHT;
}, [selectedIndex]); // selectedIndex가 바뀔 때마다 동기화
```

### 교훈
- `useEffect`의 의존성 배열은 "이 값이 바뀌면 다시 실행하라"는 뜻이다.
- 외부(prop)에서 상태가 늦게 도착하는 경우, 빈 배열 `[]`은 그 변화를 놓친다.
- "UI에 보이는 상태"와 "DOM의 실제 상태"를 따로 관리할 때는 둘의 동기화 지점을 명확히 해야 한다.

---

## 3. 문제 B — 고정 알림이 안 오고, 로컬 알림의 근본 한계

### 증상 1 — 기존 유저에게 고정 알림이 안 옴
고정 알림 3개(12/18/22시)를 추가하는 코드를 넣었지만, 기존 유저는 예전 코드로
알림 1개만 스케줄된 상태였다. 새 코드(`scheduleAlarmNotifications`)는 사용자가
알람을 **다시 저장할 때만** 실행되므로, 기존 유저는 고정 알림이 등록되지 않았다.

→ (당시 해결) 앱 시작 시 스케줄된 알림 개수를 확인해 부족하면 재등록하는 로직을 넣었다.
→ (최종) 고정 알림을 서버로 옮기면서 이 로직은 "로컬 알람 1개만 남기는 정규화"로 바뀜(5장).

### 증상 2 (근본 문제) — 완료자에게도 알림이 감
"오늘 말씀을 완료한 사용자에게는 고정 알림을 보내지 않기"를 구현하려고
`setNotificationHandler`에서 완료 여부를 검사했다.

```tsx
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isFixedAlarm = notification.request.content.data?.isFixedAlarm === true;
    if (isFixedAlarm) {
      const completedDate = await AsyncStorage.getItem("studyCompletedDate");
      const completedToday = completedDate === new Date().toDateString();
      return { shouldShowBanner: !completedToday, /* ... */ };
    }
    // ...
  },
});
```

**하지만 이건 앱이 포그라운드(켜져 있을 때)일 때만 동작한다.**

| 앱 상태 | `setNotificationHandler` 실행? |
|---------|-------------------------------|
| 포그라운드 (앱 켜짐) | ✅ 실행됨 → 완료자 차단 가능 |
| 백그라운드 / 완전 종료 | ❌ **실행 안 됨** → 완료자에게도 알림 감 |

### 왜? (핵심 학습 포인트)
`expo-notifications`의 `DAILY` 트리거는 **OS(안드로이드/iOS)가 직접 관리하는 예약 알림**이다.
앱이 꺼져 있어도 OS가 시간이 되면 알림을 발사한다. 이때는 **앱의 JS 코드가 전혀 실행되지 않으므로**
`setNotificationHandler`(JS 함수)를 거치지 않는다. 그래서 완료 여부로 거를 수가 없다.

→ 이 한계 때문에 "완료자 필터링"은 로컬 알림으로 불가능하고, **서버 푸시가 필요**하다는 결론에 도달(5장).

---

## 4. 안드로이드 알림 권한 & 배터리 최적화 개념

알림이 늦게 오거나 안 오는 문제를 파면서 정리한 안드로이드 개념들.

### 4-1. `SCHEDULE_EXACT_ALARM` 권한
- **역할**: 정확한 시간에 알람을 발사하도록 허용.
- **배경**: 안드로이드 12(API 31)부터, 정확한 시간 알람(`AlarmManager.setExact()`)을
  쓰려면 이 권한이 필요하다. 배터리 절약을 위해 정확 알람을 제한한 것.
- **없으면**: OS가 부정확한 알람(`setInexactRepeating`)으로 대체 → 15~60분씩 밀릴 수 있다.
- `expo-notifications`가 내부적으로 이 API를 쓰므로 권한이 필요.
- **적용**: `app.config.js`의 `android.permissions`에 추가. (빌드 타임 → `AndroidManifest.xml`에 반영)

```js
permissions: ["RECORD_AUDIO", "MODIFY_AUDIO_SETTINGS", "SCHEDULE_EXACT_ALARM"],
```

### 4-2. 배터리 최적화 (Doze mode)
- 안드로이드는 앱이 백그라운드/종료 상태일 때 배터리를 아끼려고 앱의 알람 실행을 지연/차단한다(Doze).
- 특히 **삼성/샤오미 등 제조사**는 표준 안드로이드보다 더 공격적인 자체 배터리 최적화 레이어가 있다.
  (한국은 삼성 비중이 높아 이게 실질적 원인이 되기 쉽다.)
- **배터리 최적화를 해제하면** 앱이 꺼져 있어도 알림이 정시에 온다(실측 확인됨).

### 4-3. 배터리 최적화 해제 유도 (검토했다가 제거)
`expo-intent-launcher`로 "이 앱의 배터리 최적화를 해제하시겠습니까?" 시스템 다이얼로그를
띄우려 시도했다. 하지만:
- 인텐트가 기기/제조사마다 안 뜨는 경우가 있었고,
- **결정적으로, 서버 푸시로 전환하면 배터리 최적화 문제 자체가 사라진다**(FCM/APNs는 OS 푸시 채널을
  쓰므로 Doze 영향을 받지 않음).
- 게다가 "1분 이내에만 오면 충분하다"는 판단.

→ 그래서 `expo-intent-launcher` 관련 코드와 패키지를 **모두 제거**했다.
   (`REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` 권한도 제거. `SCHEDULE_EXACT_ALARM`은 유지.)

### 4-4. (참고) 알람 앱에서 쓰는 다른 권한들 — 우리는 불필요
- `USE_EXACT_ALARM`: 알람/캘린더 앱 전용. 일반 앱이 쓰면 Play Store 심사 거절 위험 → **안 씀**.
- `SYSTEM_ALERT_WINDOW`: 다른 앱 위에 화면 표시(알람 해제 화면). 우리는 단순 알림이라 **불필요**.
- `FOREGROUND_SERVICE`: 계속 실행되는 서비스(음악/내비)용 → **불필요**.
- `POST_NOTIFICATIONS`: 안드 13+ 알림 런타임 권한. `expo-notifications`가 자동 처리.

---

## 5. 해결책 — 서버 푸시(Expo Push)로 전환

### 5-1. 왜 서버 푸시인가
"완료자에게는 안 보내기"를 앱이 꺼져 있을 때도 지키려면, **누가 완료했는지 아는 주체가
알림을 보내야** 한다. 그 주체는 서버다.
- 다행히 서버는 이미 완료 정보를 안다 → `study_completions` 테이블(말씀 완료 시 기록됨).
- 따라서 별도의 완료 동기화 작업이 필요 없었다.

### 5-2. Expo Push를 고른 이유 (vs 순수 FCM)
푸시 전송 방식은 두 가지:
- **Expo Push**: iOS/Android를 Expo가 통합 처리. 서버는 Expo API에 POST만 하면 됨. 구현 단순.
- **Firebase FCM Admin**: Android는 되지만 iOS는 APNs 인증서 별도 설정 필요. 공수 큼.

이미 프로젝트에 **EAS projectId**가 있어서(`app.config.js`의 `extra.eas.projectId`),
Expo Push 토큰을 바로 발급받을 수 있었다 → **Expo Push 선택**.

### 5-3. 전체 데이터 흐름

```
[앱] 로그인 → 대시보드 진입
      │  네이티브가 Expo Push 토큰 발급 (getExpoPushTokenAsync)
      ▼
[웹] usePushToken 훅이 토큰을 받아서 /api/push/register 로 전송
      │  (세션 쿠키로 사용자 식별)
      ▼
[DB] push_tokens 테이블에 (user_id, token) 저장

──────────── (매일 12/18/22시) ────────────

[스케줄러] cron-job.org 가 /api/cron/reminder?slot=12&secret=... 호출
      ▼
[웹 API] 오늘 말씀 미완료 사용자의 토큰만 조회
      │  (push_tokens 중 study_completions 에 오늘 기록 없는 유저)
      ▼
[Expo 서버] 로 푸시 요청 POST
      ▼
[FCM(안드)/APNs(iOS)] → 사용자 폰에 알림 도착
```

### 5-4. DB — 토큰 저장 테이블
`apps/web/migrations/001_push_tokens.sql`

```sql
CREATE TABLE IF NOT EXISTS push_tokens (
  user_id    VARCHAR(128) NOT NULL,
  token      TEXT         NOT NULL,
  platform   VARCHAR(16),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, token)   -- 한 유저가 여러 기기 가능, 중복 방지
);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens (user_id);
```
- `IF NOT EXISTS` → 여러 번 실행해도 안전(멱등).
- 이 마이그레이션은 프로덕션 DB에 직접 실행 완료(`push_tokens` 생성됨).

### 5-5. 토큰 등록 API
`apps/web/src/app/api/push/register/route.ts`
- `__session` 쿠키를 Firebase Admin으로 검증 → `userId` 획득.
- `INSERT ... ON CONFLICT (user_id, token) DO UPDATE` → **upsert**(있으면 갱신, 없으면 삽입).

`apps/web/src/app/api/push/unregister/route.ts`
- 인증은 register와 동일(`__session` 쿠키 → `userId`).
- body에 `token`을 실으면 그 기기 토큰만 삭제, `token` 없이 호출하면 그 `userId`의 토큰 전부 삭제.
  (body 자체를 안 보내도 `request.json().catch(() => ({ token: null }))`로 안전하게 `token: null` 처리됨.)
- **연결 지점**: `DashboardHeader.tsx`와 `StorageView.tsx`의 `handleLogout` / `handleWithdraw` 양쪽에서 호출.
  반드시 `/api/auth/clear-session`(쿠키 삭제) **이전**에 호출해야 한다 — 순서가 바뀌면 쿠키가 먼저 사라져 401.
  ```tsx
  await fetch("/api/push/unregister", { method: "POST" }); // 쿠키 살아있을 때 먼저
  await terminateDataConnect();
  await fetch("/api/auth/clear-session", { method: "POST" }); // 그 다음 쿠키 삭제
  await signOut(fireAuth);
  ```
- **왜 필요한가**: 로그아웃/탈퇴해도 `push_tokens`를 안 지우면, 같은 기기에서 다른 계정으로 로그인했을 때
  이전 계정 몫의 리마인더가 여전히 그 기기로 발송될 수 있다. 탈퇴 시엔 `deleteUser`(dataconnect)가
  `users`/`study_completions` 테이블은 정리하지만 `push_tokens`는 FK 관계가 아니라 별도로 정리해야 함.

### 5-6. cron 엔드포인트 (핵심)
`apps/web/src/app/api/cron/reminder/route.ts`

동작 순서:
1. **인증**: `Authorization: Bearer <CRON_SECRET>` 헤더 또는 `?secret=` 쿼리 검증.
2. **slot → 문구 선택**: `?slot=12|18|22` 로 메시지 결정.
   ```ts
   const MESSAGES = {
     '12': 'tolli 배고파요 🌿 말씀의 양식을 채워주세요.',
     '18': '아직 배가 고파요 😢 오늘 말씀이 아직 남아있어요.',
     '22': '오늘 말씀, 자기 전에 꼭 채우고 자요 🌙',
   };
   ```
3. **미완료자 토큰 조회**: `study_completions`에 오늘(한국 자정 기준) 기록이 없는 유저의 토큰.
   ```sql
   SELECT DISTINCT pt.token FROM push_tokens pt
   WHERE pt.user_id NOT IN (
     SELECT user_id FROM study_completions WHERE completed_at >= $1
   )
   ```
   (`$1` = `getLocalMidnight('Asia/Seoul')` — 오늘 자정)
4. **Expo API로 100개씩 배치 전송**: `https://exp.host/--/api/v2/push/send`
5. **만료 토큰 정리**: 응답에서 `DeviceNotRegistered`인 토큰은 DB에서 삭제.

응답 예: `{ ok: true, sent: N, removed: M }`

### 5-7. 웹 → 토큰 등록 훅
`apps/web/src/app/dashboard/_hooks/usePushToken.ts`
- 대시보드(로그인 이후 진입점 → 세션 보장)에서 네이티브에 `GET_EXPO_PUSH_TOKEN` 요청.
- 네이티브가 `EXPO_PUSH_TOKEN`으로 응답하면 `/api/push/register` 호출.
- `DashboardClient.tsx`에서 `usePushToken(shouldRefreshSession)`로 사용.

### 5-8. 네이티브 변경
`apps/native/App.tsx`
- **로컬 고정 알림 3개 제거**. `scheduleAlarmNotifications`는 이제 **사용자 알람 1개만** 스케줄.
  ```tsx
  async function scheduleAlarmNotifications(hour, minute) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: "오늘의 말씀 🐘", body: "...", sound: "default" },
      trigger: { type: DAILY, hour, minute },
    });
  }
  ```
- **시작 시 정규화**: 구버전에서 남은 고정 알림 3개를 정리하고 사용자 알람 1개만 남김.
  ```tsx
  if (scheduled.length !== 1) { await scheduleAlarmNotifications(hour, minute); }
  ```
- **`GET_EXPO_PUSH_TOKEN` 핸들러 추가**: 권한 확인 후 토큰 발급해 웹에 전달.
  ```tsx
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  webviewRef.current?.postMessage(JSON.stringify({
    type: "EXPO_PUSH_TOKEN", token: tokenData.data, platform: Platform.OS,
  }));
  ```
- `setNotificationHandler`의 완료자 필터는 **포그라운드 이중 안전장치**로 유지
  (서버가 주 필터, 앱이 켜진 순간 도착한 푸시는 로컬에서 한 번 더 거름).

### 5-9. 스케줄러 — Vercel Cron 대신 외부 스케줄러
처음엔 `vercel.json`에 크론 3개를 넣었다(UTC 기준):
```
12:00 KST = 03:00 UTC → "0 3 * * *"
18:00 KST = 09:00 UTC → "0 9 * * *"
22:00 KST = 13:00 UTC → "0 13 * * *"
```

**하지만 현재 Vercel 플랜이 Hobby**라서 문제가 있었다:
| Hobby 제약 | 영향 |
|-----------|------|
| 크론 최대 2개 | 3개 필요 → 초과 |
| 트리거 정시 보장 안 됨(최대 1시간 지연) | 22시 알림이 22:59에 올 수 있음 |

→ `vercel.json`을 **삭제**하고, 무료 외부 스케줄러 **cron-job.org**로 대체.
- 개수 무제한, 분 단위 정확.
- 시간대 **Asia/Seoul**로 3개 작업 등록, 각각 아래 URL 호출:
  ```
  https://tolli-fe-web-lilac.vercel.app/api/cron/reminder?slot=12&secret=<CRON_SECRET>
  https://tolli-fe-web-lilac.vercel.app/api/cron/reminder?slot=18&secret=<CRON_SECRET>
  https://tolli-fe-web-lilac.vercel.app/api/cron/reminder?slot=22&secret=<CRON_SECRET>
  ```
- 나중에 Pro로 올리면 `vercel.json`의 `crons`로 되돌릴 수 있음.

### 5-10. `CRON_SECRET`
- cron 엔드포인트를 아무나 호출 못 하게 막는 비밀 값.
- **같은 값**을 (1) Vercel 환경변수, (2) cron-job.org URL의 `secret=`에 넣어야 함.
- 로컬 테스트 시엔 `apps/web/.env`에도 넣으면 됨(`.env`는 gitignore됨 → 안전).
- 생성 예: `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"`

---

## 6. FirebaseApp 초기화 문제 & gradle 수동 설정

Android에서 `getExpoPushTokenAsync`를 호출하니 이 에러가 났다:
```
Default FirebaseApp is not initialized in this process com.company.tolli.
Make sure to call FirebaseApp.initializeApp(Context) first.
```

### 원인 (핵심 학습 포인트)
Android에서 Expo Push 토큰을 받으려면 **Firebase(FCM)가 초기화**돼야 한다.
그런데 `google-services.json`이 없거나, 이 파일을 읽는 **google-services gradle 플러그인이
적용 안 돼 있으면** FirebaseApp이 초기화되지 않는다.

확인해보니:
- `google-services.json`이 아예 없었다(`.gitignore`로 제외돼 있고, `android/` 폴더가 재생성되며 사라짐).
- 파일을 넣어도 `pnpm android`(=`expo run:android`)는 **기존 `android/` 폴더가 있으면
  prebuild를 다시 안 돌린다** → config 변경이 반영 안 됨.

### 두 개의 다른 파일을 구별하기 (자주 헷갈림)
| 파일 | 용도 | 위치 |
|------|------|------|
| `google-services.json` | **기기에서** Firebase 초기화 (클라이언트 설정) | `apps/native/google-services.json` |
| 서비스 계정 키 JSON | **서버→FCM** 인증 (비밀 키) | EAS에 업로드 (Firebase 콘솔 → 서비스 계정 → 새 비공개 키) |

### 해결 방법 선택
`expo prebuild --clean`이면 자동 처리되지만, `android/` 안에 수동으로 넣은 값들이 사라질까 봐
**`--clean`을 쓰지 않고 필요한 3가지만 수동 적용**했다. (참고: `android/`는 gitignore된 생성
폴더라 원칙적으론 clean이 안전하지만, 안전하게 수동으로 진행)

google-services 플러그인이 하는 일 = 딱 3가지:

**1) 파일 복사** — `google-services.json` → `android/app/`

**2) `android/build.gradle`에 classpath 추가**
```gradle
dependencies {
  // ...
  classpath('com.google.gms:google-services:4.4.2')
}
```

**3) `android/app/build.gradle`에 플러그인 적용**
```gradle
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"
apply plugin: "com.google.gms.google-services"  // ← 추가
```

이후 `pnpm android` 재빌드 → 빌드 중 `:app:processDebugGoogleServices` 태스크 실행 →
FirebaseApp 초기화 → 에러 사라지고 토큰 발급 성공.

### app.config.js에도 설정 (향후 clean 대비)
수동 gradle 수정은 `android/`가 재생성되면 사라진다. 그래서 config에도 넣어둠 →
나중에 `expo prebuild`가 자동으로 같은 작업을 해준다.
```js
android: {
  // ...
  googleServicesFile: "./google-services.json",
}
// google-signin 플러그인의 googleServicesFile 경로도 "./google-services.json"로 통일
```
또한 `.gitignore`에 `google-services.json`, `GoogleService-Info.plist` 추가(루트에 둬도 커밋 안 되게).

### EAS에 FCM V1 서비스 계정 키 업로드
`getExpoPushTokenAsync`로 토큰을 받는 것과, **Expo 서버가 그 토큰으로 실제 배달하는 것**은 별개다.
Expo가 구글 FCM에 대신 보내려면 **인증서(FCM V1 서비스 계정 키)**가 EAS에 있어야 한다.
```bash
cd apps/native
npx eas-cli credentials
# Android → Google Service Account
#   → Manage your Google Service Account Key for Push Notifications (FCM V1)
#   → Set up ... → Firebase 콘솔에서 받은 서비스 계정 JSON 경로 지정
```
→ 업로드 완료(`Push Notifications (FCM V1): ... assigned`).

### 최종 검증
로컬 웹 서버(`localhost:3000`)는 프로덕션 DB(`34.158.212.3`)에 붙는다. 앱(dev)이
`localhost:3000`을 보고 있으니 토큰이 프로덕션 DB에 등록된다. 그 상태에서:
```
curl "http://localhost:3000/api/cron/reminder?slot=12&secret=<CRON_SECRET>"
→ {"ok":true,"sent":1,"removed":0}   # 폰에 알림 도착 ✅
```
(두 번째 즉시 호출이 `sent:0`인 건 Expo의 중복/rate-limit 필터 때문. 실제론 몇 시간 간격이라 무관.)

---

## 7. iOS(APNs)

- iOS는 FCM이 아니라 **APNs(Apple Push Notification service)**를 쓴다.
- 6장에서 한 FCM 설정은 iOS엔 적용 안 됨. iOS는 **APNs 키(.p8)를 EAS에 등록**해야 한다.
- **코드는 동일하게 동작**한다(`getExpoPushTokenAsync`가 iOS에선 APNs 기반 토큰을 반환).
- 이미 App Store 출시 앱이고 EAS로 빌드한 적이 있으면 APNs 키가 자동 등록돼 있을 가능성이 높다.
- 확인: `npx eas-cli credentials` → iOS →
  `Push Notifications (Apple Push Notifications service key)` 항목에 키가 있으면 준비 완료.
- 주의: iOS 푸시는 **실기기에서만** 테스트 가능(시뮬레이터 불가), 빌드는 EAS Build로.

---

## 8. 용어 정리

- **로컬 알림 (Local Notification)**: 기기 OS가 예약해 발사하는 알림. 앱이 꺼져도 오지만,
  발사 시 앱 JS 코드가 안 돌아 "조건부 필터링"이 불가능.
- **푸시 알림 (Push Notification)**: 서버가 푸시 서비스(FCM/APNs)를 통해 보내는 알림.
  서버가 조건을 판단해 보낼지 말지 결정할 수 있음.
- **FCM (Firebase Cloud Messaging)**: 구글의 안드로이드 푸시 전송 채널.
- **APNs (Apple Push Notification service)**: 애플의 iOS 푸시 전송 채널.
- **Expo Push**: FCM/APNs를 감싸서 통합 API로 제공하는 Expo 서비스.
  서버는 Expo에 POST만 하면 Expo가 FCM/APNs로 중계.
- **Expo Push Token**: `ExponentPushToken[...]` 형태. Expo에 보낼 때 쓰는 기기 식별자.
- **`DAILY` 트리거**: `expo-notifications`의 매일 반복 로컬 알림 트리거.
- **`setNotificationHandler`**: 앱이 **포그라운드**일 때 도착한 알림을 어떻게 표시할지 결정하는 JS 콜백.
- **Doze mode**: 안드로이드 배터리 절약 모드. 백그라운드 앱의 알람을 지연/차단.
- **prebuild**: Expo가 `app.config.js`(config 플러그인)를 읽어 네이티브 폴더(`android`/`ios`)를
  생성/갱신하는 과정. `--clean`은 폴더를 지우고 새로 만듦.
- **config plugin**: 네이티브 파일을 직접 수정하지 않고, config로 네이티브 설정을 선언하는 방식.
- **upsert**: 있으면 UPDATE, 없으면 INSERT (`INSERT ... ON CONFLICT ... DO UPDATE`).
- **멱등(idempotent)**: 여러 번 실행해도 결과가 같은 성질(예: `CREATE TABLE IF NOT EXISTS`).

---

## 9. 전체 변경 파일 목록

### 웹 (`apps/web`)
| 파일 | 변경 |
|------|------|
| `migrations/001_push_tokens.sql` | 신규 — 토큰 테이블 |
| `src/app/api/push/register/route.ts` | 신규 — 토큰 등록(upsert) |
| `src/app/api/push/unregister/route.ts` | 신규 — 토큰 삭제 |
| `src/app/api/cron/reminder/route.ts` | 신규 — 미완료자 조회 + Expo 발송 |
| `src/app/dashboard/_hooks/usePushToken.ts` | 신규 — 토큰 받아 등록 |
| `src/app/dashboard/_components/DashboardClient.tsx` | `usePushToken` 연결 |
| `src/app/dashboard/_components/DashboardHeader.tsx` | `handleLogout`/`handleWithdraw`에서 `clear-session` 전 `unregister` 호출 추가 |
| `src/app/dashboard/storage/_components/StorageView.tsx` | 위와 동일하게 `unregister` 호출 추가 |
| `src/app/signup/set-alarm-time/_components/WheelPicker.tsx` | useEffect 의존성 `[selectedIndex]` + 드래그 가드 |
| `PUSH_SETUP.md` | 신규 — 배포 가이드 |
| `vercel.json` | 생성했다가 **삭제**(Hobby 비호환) |

### 네이티브 (`apps/native`)
| 파일 | 변경 |
|------|------|
| `App.tsx` | 로컬 고정 알림 제거, 사용자 알람만 스케줄, `GET_EXPO_PUSH_TOKEN` 추가, 시작 시 정규화 |
| `app.config.js` | `SCHEDULE_EXACT_ALARM` 권한, `android.googleServicesFile`, google-signin 경로 통일 |
| `.gitignore` | `google-services.json`, `GoogleService-Info.plist` 추가 |
| `android/build.gradle` | google-services classpath 4.4.2 (수동) |
| `android/app/build.gradle` | google-services 플러그인 apply (수동) |
| `android/app/google-services.json` | 배치 (수동 복사) |
| (제거) `expo-intent-launcher` | 설치했다가 제거 |

### 인프라 (코드 외, 이번에 완료한 것)
- 프로덕션 DB에 `push_tokens` 테이블 생성 ✅
- EAS에 FCM V1 서비스 계정 키 업로드 ✅
- `CRON_SECRET` 값 생성 ✅

---

## 10. 남은 작업 체크리스트

프로덕션 반영을 위해 남은 것:

- [ ] `refactor/alarm` → `main` 머지 (웹 API 프로덕션 배포)
- [ ] Vercel 환경변수 `CRON_SECRET` 추가 (Production) 후 재배포
- [ ] cron-job.org에 12/18/22시(Asia/Seoul) 작업 3개 등록 (도메인 `tolli-fe-web-lilac.vercel.app`)
- [ ] 앱 재빌드 & 배포 (`pnpm android` / iOS는 EAS Build)
- [ ] iOS: `eas credentials`로 APNs 키 등록 여부 확인
- [ ] 프로덕션에서 수동 트리거로 최종 확인
      (`curl ".../api/cron/reminder?slot=12&secret=..."` → `sent >= 1`)

### 검증 시 자주 하는 실수
- `sent: 0`이 나오면? → (1) 알림 권한 허용 안 함, (2) 토큰 미등록,
  (3) **오늘 말씀을 이미 완료한 계정**(완료자는 정상적으로 필터링됨).
- 반드시 **오늘 말씀 미완료 계정**으로 테스트할 것.
