# 미완료자 리마인더 푸시 (Expo Push) 설정

12:00 / 18:00 / 22:00(KST)에 **오늘 말씀을 완료하지 않은 사용자**에게만
서버에서 푸시를 발송한다. 사용자가 직접 설정한 알람은 기존처럼 기기 로컬에서 동작한다.

## 구성 요소

| 위치 | 파일 | 역할 |
|------|------|------|
| DB | `migrations/001_push_tokens.sql` | Expo 토큰 저장 테이블 |
| 웹 API | `src/app/api/push/register/route.ts` | 로그인 사용자 토큰 등록(upsert) |
| 웹 API | `src/app/api/push/unregister/route.ts` | 토큰 삭제(로그아웃 등) |
| 웹 API | `src/app/api/cron/reminder/route.ts` | 미완료자 조회 + Expo 발송 |
| 웹 | `src/app/dashboard/_hooks/usePushToken.ts` | 네이티브에서 토큰 받아 서버 등록 |
| 스케줄 | 외부 스케줄러(cron-job.org) | 12/18/22시(KST)에 엔드포인트 호출 |
| 앱 | `apps/native/App.tsx` | `GET_EXPO_PUSH_TOKEN` 응답, 로컬 고정알림 제거 |

## 배포 절차

### 1. DB 마이그레이션
```bash
psql "<CLOUD_SQL_CONNECTION>" -f apps/web/migrations/001_push_tokens.sql
```
또는 Cloud SQL 콘솔 쿼리 편집기에 `001_push_tokens.sql` 내용 붙여넣기.

### 2. 환경변수 (Vercel Production)
- `CRON_SECRET` : 임의의 긴 문자열. Vercel Cron이 `Authorization: Bearer <값>`으로 호출하고, 라우트가 이를 검증한다.
- (기존) `DB_HOST` `DB_USER` `DB_PASSWORD` `DB_NAME` `DB_PORT` : 대시보드 SSR과 동일하게 이미 설정되어 있어야 함.

### 3. 웹 배포
`main` 머지 → Vercel 자동 배포.

### 4. 스케줄러 등록 (cron-job.org)
현재 Vercel **Hobby 플랜**이라 Vercel Cron은 사용하지 않는다.
(Hobby는 크론 2개 제한 + 정시 보장 안 됨). 무료 외부 스케줄러
[cron-job.org](https://cron-job.org)에 아래 3개 작업을 등록한다. 시간대는 **Asia/Seoul**.

| 시각(KST) | 호출 URL |
|-----------|----------|
| 12:00 | `https://tolli-fe-web-lilac.vercel.app/api/cron/reminder?slot=12&secret=<CRON_SECRET>` |
| 18:00 | `https://tolli-fe-web-lilac.vercel.app/api/cron/reminder?slot=18&secret=<CRON_SECRET>` |
| 22:00 | `https://tolli-fe-web-lilac.vercel.app/api/cron/reminder?slot=22&secret=<CRON_SECRET>` |

> 나중에 Vercel Pro로 올리면 `vercel.json`에 `crons` 배열을 추가해
> (03/09/13시 UTC) 외부 스케줄러를 대체할 수 있다.

### 5. 앱 재빌드
`SCHEDULE_EXACT_ALARM` 권한 추가 + 로컬 고정알림 제거가 포함되므로 재빌드 필요.
```bash
pnpm android   # 또는 EAS Build (iOS 포함)
```

## 동작 확인
```bash
# 수동 트리거 (배포 후)
curl "https://tolli-fe-web-lilac.vercel.app/api/cron/reminder?slot=12&secret=<CRON_SECRET>"
# → { ok: true, sent: N, removed: M }
```

## 참고
- 완료 판정은 `study_completions.completed_at >= 오늘 자정(Asia/Seoul)` 기준.
- Expo가 반환한 `DeviceNotRegistered` 토큰은 자동으로 DB에서 삭제된다.
- 앱이 포그라운드일 때 도착한 푸시는 `setNotificationHandler`가 로컬
  `studyCompletedDate`로 한 번 더 필터링한다(이중 안전장치).
