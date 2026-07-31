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
          registerVariant(posthog, variant);
        }

        if (!cancelled) setState({ status: "ready", variant });
      } catch {
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
