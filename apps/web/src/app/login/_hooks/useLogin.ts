import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useCallback, useEffect, useState } from "react";
import {
  signInWithAppleToken,
  signInWithGoogleToken,
  signInWithKakaoToken,
} from "@/firebase/fireAuth";

type Provider = "kakao" | "google" | "apple";

const MESSAGE_TYPE: Record<Provider, string> = {
  kakao: "KAKAO_LOGIN",
  google: "GOOGLE_LOGIN",
  apple: "APPLE_LOGIN",
};

export default function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLogin = (provider: Provider) => {
    setError(null);
    posthog.capture("login_clicked", { provider: { provider } });
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: MESSAGE_TYPE[provider] }),
    );
  };

  const redirectAfterLogin = useCallback(
    async (
      signInFn: () => Promise<{
        getIdToken: (force: boolean) => Promise<string>;
      }>,
    ) => {
      setLoading(true);
      try {
        const signedInUser = await signInFn();
        const idToken = await signedInUser.getIdToken(true);
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        if (payload.registered) {
          posthog.capture("login_success", { is_new_user: false });
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "SET_LOGGED_IN" }),
          );
          router.push("/dashboard");
        } else {
          posthog.capture("login_success", { is_new_user: true });
          router.push("/terms");
        }
      } catch {
        setLoading(false);
        setError("로그인에 실패했어요. 다시 시도해주세요.");
      }
    },
    [router],
  );

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)apple_id_token=([^;]+)/);
    const appleToken = match ? decodeURIComponent(match[1]) : null;
    if (appleToken) {
      document.cookie = "apple_id_token=; max-age=0; path=/";
      redirectAfterLogin(() => signInWithAppleToken(appleToken));
    }
  }, [redirectAfterLogin]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const { type, token, rawNonce } = JSON.parse(e.data);
        if (type === "GOOGLE_TOKEN" && token) {
          redirectAfterLogin(() => signInWithGoogleToken(token));
        }
        if (type === "APPLE_TOKEN" && token) {
          redirectAfterLogin(() => signInWithAppleToken(token, rawNonce));
        }
        if (type === "KAKAO_TOKEN" && token) {
          redirectAfterLogin(() => signInWithKakaoToken(token));
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage as EventListener);
    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  }, []);

  return {
    loading,
    error,
    requestLogin,
  };
}
