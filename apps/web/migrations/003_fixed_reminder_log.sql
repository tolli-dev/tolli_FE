-- 고정 알림(12/18/22시)의 하루 1회 중복 발송 방지용 로그 테이블.
-- reminder 크론에는 커스텀 알람(alarm_settings.last_sent_on)과 달리 중복 방지
-- 가드가 없어, 크론이 재시도되거나 중복 호출되면 같은 slot이 2번 발송됐다.
-- (slot, sent_on)을 원자적으로 선점(INSERT ... ON CONFLICT DO NOTHING)해서
-- 하루에 slot당 한 번만 발송되도록 한다.
--
-- 실행: psql "$DATABASE_URL" -f apps/web/migrations/003_fixed_reminder_log.sql
--  또는 Cloud SQL 콘솔 쿼리 편집기에 붙여넣기

CREATE TABLE IF NOT EXISTS fixed_reminder_log (
  slot     VARCHAR(2)  NOT NULL,  -- "12" | "18" | "22"
  sent_on  DATE        NOT NULL,  -- 발송한 KST 날짜
  sent_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (slot, sent_on)
);
