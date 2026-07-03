-- 사용자 커스텀 알람을 서버(Expo Push)에서 발송하기 위한 설정 저장 테이블.
-- 기존에는 기기 로컬(AsyncStorage + expo-notifications)에만 있어서, 앱이 꺼지면
-- "오늘 완료했는지"로 알림을 거를 수 없었다. 서버가 발송 시점에 완료 여부를 보고
-- 미완료자에게만 보내려면 알람 시간이 서버 DB에 있어야 한다.
--
-- 실행: psql "$DATABASE_URL" -f apps/web/migrations/002_alarm_settings.sql
--  또는 Cloud SQL 콘솔 쿼리 편집기에 붙여넣기

CREATE TABLE IF NOT EXISTS alarm_settings (
  user_id      VARCHAR(128) PRIMARY KEY,
  hour         SMALLINT     NOT NULL,   -- 0~23 (사용자 로컬/KST 기준 시)
  minute       SMALLINT     NOT NULL,   -- 0~59
  enabled      BOOLEAN      NOT NULL DEFAULT true,
  last_sent_on DATE,                    -- 마지막으로 커스텀 알람을 보낸 KST 날짜 (하루 1회 중복 방지)
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 매분 크론이 "지금 시각에 알람이 걸린 사용자"를 빠르게 찾도록 인덱스
CREATE INDEX IF NOT EXISTS idx_alarm_settings_time
  ON alarm_settings (enabled, hour, minute);
