"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getMe } from "@firebasegen/default-connector";
import { QueryFetchPolicy } from "firebase/data-connect";
import posthog from "posthog-js";
import { fireAuth } from "@/firebase/fireAuth";
import { dataConnect } from "@/lib/dataconnect";
import {
  EXPERIMENT_KEY,
  Variant,
  VARIANT_CONTROL,
  isInExperiment,
  registerVariant,
  resolveVariant,
} from "@/lib/experiment";

type VariantState =
  | { status: "loading" }
  | { status: "ready"; variant: Variant };

/**
 * 현재 로그인한 유저의 A/B 그룹을 확정하고, PostHog에 그 사실을 심는다.
 *
 * 여기서 하는 일이 두 가지다.
 *
 * 1) `posthog.identify(uid)` — 지금까지 이 앱은 identify를 한 번도 부르지 않아서
 *    모든 이벤트가 익명 디바이스 ID에 붙고 있었다. uid로 그룹을 나누는 실험은
 *    이벤트가 uid에 묶여야 분석이 가능하므로 여기서 신원을 확정한다.
 *
 * 2) `posthog.setPersonProperties` — 그룹을 person 속성으로 박아두면, 이 유저가
 *    이후에 남기는 모든 이벤트를 그룹별로 쪼개 볼 수 있다. 이벤트마다 그룹을
 *    일일이 붙이지 않아도 되고, 대시보드에서 이탈 지점을 그룹별로 비교할 수 있다.
 */
export function useExperimentVariant(): VariantState {
  const [state, setState] = useState<VariantState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      try {
        const uid = fireAuth.currentUser?.uid ?? null;
        const result = await getMe(dataConnect, {
          fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
        });
        const termsAgreedAt = result.data.user?.termsAgreedAt ?? null;
        const variant = resolveVariant(uid, termsAgreedAt);

        if (uid) {
          posthog.identify(uid, {
            [EXPERIMENT_KEY]: variant,
            experiment_enrolled: isInExperiment(termsAgreedAt),
            terms_agreed_at: termsAgreedAt,
          });
          // 이후 모든 이벤트에 그룹이 자동으로 붙게 한다. 이탈/완료 이벤트
          // 호출부를 하나하나 고치지 않아도 그룹별 비교가 가능해진다.
          registerVariant(posthog, variant);
        }

        if (!cancelled) setState({ status: "ready", variant });
      } catch {
        // 그룹을 못 정하면 실험을 포기하고 대조군(현재 배포된 플로우)으로 보낸다.
        // 학습 진입 자체를 막는 것보다 낫다.
        if (!cancelled) setState({ status: "ready", variant: VARIANT_CONTROL });
      }
    };

    if (fireAuth.currentUser) {
      resolve();
      return () => {
        cancelled = true;
      };
    }

    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      if (!user) return;
      resolve();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return state;
}
