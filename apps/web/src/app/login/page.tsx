"use client";

import { useCallback, useEffect, useState } from "react";
import {
  signInWithAppleToken,
  signInWithGoogleToken,
  signInWithKakaoToken,
} from "@/firebase/fireAuth";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import Header from "./_components/Header";
import Loading from "./_components/Loading";
import Login from "./_components/Login";
import LoginActions from "./_components/LoginActions";
import TolliLogoImage from "./_components/TolliLogoImage";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestKakaoLogin = () => {
    setError(null);
    posthog.capture("login_clicked", { provider: "kakao" });
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "KAKAO_LOGIN" }),
    );
  };

  const requestGoogleLogin = () => {
    setError(null);
    posthog.capture("login_clicked", { provider: "google" });
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "GOOGLE_LOGIN" }),
    );
  };

  const requestAppleLogin = () => {
    setError(null);
    posthog.capture("login_clicked", { provider: "apple" });
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "APPLE_LOGIN" }),
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

  return (
    <Login>
      <Loading loading={loading} />
      <Header />
      <TolliLogoImage />
      <LoginActions
        error={error}
        requestKakaoLogin={requestKakaoLogin}
        requestGoogleLogin={requestGoogleLogin}
        requestAppleLogin={requestAppleLogin}
      />
    </Login>
  );
}
