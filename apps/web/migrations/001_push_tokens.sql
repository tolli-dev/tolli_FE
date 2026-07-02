-- 미완료 사용자 리마인더 푸시를 위한 Expo Push 토큰 저장 테이블
-- 실행: psql "$DATABASE_URL" -f apps/web/migrations/001_push_tokens.sql
--  또는 Cloud SQL 콘솔 쿼리 편집기에 붙여넣기

CREATE TABLE IF NOT EXISTS push_tokens (
  user_id    VARCHAR(128) NOT NULL,
  token      TEXT         NOT NULL,
  platform   VARCHAR(16),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, token)
);

-- 미완료 사용자 조회(user_id 기준) 최적화
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens (user_id);
