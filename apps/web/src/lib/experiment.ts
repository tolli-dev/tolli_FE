export const EXPERIMENT_START_DATE = '2026-08-01';

export const EXPERIMENT_KEY = 'onboarding_intro_step';

export type Variant = 'A' | 'B';

export const VARIANT_CONTROL: Variant = 'A';
export const VARIANT_SKIP_STEP1: Variant = 'B';

export function getVariant(uid: string): Variant {
  return hashUid(uid) % 2 === 0 ? VARIANT_SKIP_STEP1 : VARIANT_CONTROL;
}

function hashUid(uid: string): number {
  const FNV_OFFSET_BASIS = 2166136261;
  const FNV_PRIME = 16777619;

  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < uid.length; i += 1) {
    hash ^= uid.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }
  return hash >>> 0;
}

export function isInExperiment(termsAgreedAt: string | null | undefined): boolean {
  if (!termsAgreedAt) return false;

  const agreedAt = new Date(termsAgreedAt);
  if (Number.isNaN(agreedAt.getTime())) return false;

  return agreedAt >= new Date(`${EXPERIMENT_START_DATE}T00:00:00.000Z`);
}

export function resolveVariant(
  uid: string | null | undefined,
  termsAgreedAt: string | null | undefined,
): Variant {
  if (!uid || !isInExperiment(termsAgreedAt)) return VARIANT_CONTROL;
  return getVariant(uid);
}

export function getEntryStep(variant: Variant): number {
  return variant === VARIANT_SKIP_STEP1 ? 0 : 1;
}

export const ENROLLED_KEY = 'experiment_enrolled';

export function registerVariant(
  posthog: PostHogLike,
  variant: Variant,
  enrolled: boolean,
): void {
  posthog.register({ [EXPERIMENT_KEY]: variant, [ENROLLED_KEY]: enrolled });
}

type PostHogLike = {
  register: (properties: Record<string, unknown>) => void;
};
