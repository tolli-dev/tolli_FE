/**
 * 온보딩 학습 플로우 A/B 테스트.
 *
 * 배경: step0(구절 읽기)의 이탈률이 높아 step0을 건너뛰고 step1부터 시작하도록
 * 바꿨는데(898fa43), 이후 step1(단어 뜻 탭)의 이탈률도 여전히 높게 관측됐다.
 * 그래서 "어느 쪽 도입부가 더 잘 남는가"를 직접 비교한다.
 *
 * - variant A (대조군): 현재 상태. step1 → step2 (step0 없음)
 * - variant B (실험군): step0 → step2 (step1 없음)
 *
 * 두 그룹 모두 도입부 화면을 정확히 하나만 보고 빈칸 연습에 진입하므로,
 * "어떤 도입부냐"만 달라지고 화면 수는 같다.
 */

/** 이 날짜 이후에 가입한 유저만 실험 대상. 그 이전 유저는 기존 플로우를 유지한다. */
export const EXPERIMENT_START_DATE = "2026-08-01";

/** PostHog 이벤트/속성에서 이 실험을 식별하는 키. 대시보드 쿼리와 반드시 일치해야 한다. */
export const EXPERIMENT_KEY = "onboarding_intro_step";

export type Variant = "A" | "B";

/** 대조군: 지금 배포된 그대로 step1에서 시작 */
export const VARIANT_CONTROL: Variant = "A";
/** 실험군: step0에서 시작하고 step1을 건너뜀 */
export const VARIANT_SKIP_STEP1: Variant = "B";

/**
 * Firebase uid는 숫자가 아니라 128자 문자열이라 그대로 홀짝을 낼 수 없다.
 * (schema.gql의 User.id — 예: "xK3mP9aQ...")
 *
 * 그래서 uid를 FNV-1a로 해싱한 뒤 그 값의 홀짝으로 그룹을 나눈다. 해시는
 * 결정론적이므로 같은 유저는 기기·세션·재로그인과 무관하게 항상 같은 그룹에
 * 들어가고, 서버에 배정 상태를 저장할 필요도 없다.
 *
 * 홀수 → A(대조군), 짝수 → B(실험군).
 */
export function getVariant(uid: string): Variant {
  return hashUid(uid) % 2 === 0 ? VARIANT_SKIP_STEP1 : VARIANT_CONTROL;
}

/** FNV-1a 32비트 해시. 암호학용이 아니라 균등 분배용이다. */
function hashUid(uid: string): number {
  const FNV_OFFSET_BASIS = 2166136261;
  const FNV_PRIME = 16777619;

  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < uid.length; i += 1) {
    hash ^= uid.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }
  // >>> 0 으로 부호 없는 32비트로 만든다. imul 결과는 음수가 될 수 있다.
  return hash >>> 0;
}

/**
 * 실험 대상 여부. 실험 시작일 이전에 가입한 기존 유저는 플로우가 도중에 바뀌면
 * 혼란스럽고 지표도 오염되므로 제외한다.
 *
 * `termsAgreedAt`은 가입 시점에 기록되는 값이라 신규 유저 판별 기준으로 쓴다.
 */
export function isInExperiment(termsAgreedAt: string | null | undefined): boolean {
  if (!termsAgreedAt) return false;

  const agreedAt = new Date(termsAgreedAt);
  if (Number.isNaN(agreedAt.getTime())) return false;

  return agreedAt >= new Date(`${EXPERIMENT_START_DATE}T00:00:00.000Z`);
}

/** 실험 대상이 아니면 대조군과 동일한 플로우를 그대로 쓴다. */
export function resolveVariant(
  uid: string | null | undefined,
  termsAgreedAt: string | null | undefined,
): Variant {
  if (!uid || !isInExperiment(termsAgreedAt)) return VARIANT_CONTROL;
  return getVariant(uid);
}

/** 해당 그룹이 학습을 시작하는 첫 스텝. */
export function getEntryStep(variant: Variant): number {
  return variant === VARIANT_SKIP_STEP1 ? 0 : 1;
}

/**
 * 확정된 그룹을 PostHog super property로 등록한다.
 *
 * 이탈/완료 이벤트는 학습 플로우 깊숙한 곳에서 발생하는데, 거기까지 그룹 값을
 * prop으로 내려보내면 관련 없는 컴포넌트들이 실험을 알아야 한다. super property로
 * 등록해두면 이후 이 브라우저에서 발생하는 모든 이벤트에 자동으로 붙으므로,
 * 각 이벤트 호출부를 건드리지 않고도 그룹별로 쪼개 볼 수 있다.
 *
 * super property는 localStorage에 저장되어 세션이 끊겨도 유지된다.
 */
export function registerVariant(posthog: PostHogLike, variant: Variant): void {
  posthog.register({ [EXPERIMENT_KEY]: variant });
}

/** posthog-js 인스턴스 중 이 모듈이 실제로 쓰는 부분만. */
type PostHogLike = {
  register: (properties: Record<string, unknown>) => void;
};
