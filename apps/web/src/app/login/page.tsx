"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  signInWithAppleToken,
  signInWithGoogleToken,
  signInWithKakaoToken,
} from "@/firebase/fireAuth";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestKakaoLogin = () => {
    setError(null);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "KAKAO_LOGIN" }),
    );
    setLoading(true);
  };

  const requestGoogleLogin = () => {
    setError(null);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "GOOGLE_LOGIN" }),
    );
    setLoading(true);
  };

  const requestAppleLogin = () => {
    setError(null);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "APPLE_LOGIN" }),
    );
    setLoading(true);
  };

  const redirectAfterLogin = useCallback(
    async (
      signInFn: () => Promise<{
        getIdToken: (force: boolean) => Promise<string>;
      }>,
    ) => {
      try {
        const signedInUser = await signInFn();
        const idToken = await signedInUser.getIdToken(true);
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        if (payload.registered) {
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "SET_LOGGED_IN" }),
          );
          router.push("/dashboard");
        } else {
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
    const params = new URLSearchParams(window.location.search);
    const appleToken = params.get("apple_token");
    if (appleToken) {
      redirectAfterLogin(() => signInWithAppleToken(appleToken));
    }
  }, [redirectAfterLogin]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const { type, token } = JSON.parse(e.data);
        if (type === "GOOGLE_TOKEN" && token) {
          redirectAfterLogin(() => signInWithGoogleToken(token));
        }
        if (type === "APPLE_TOKEN" && token) {
          redirectAfterLogin(() => signInWithAppleToken(token));
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
    <div className="flex flex-col flex-1 items-center justify-center h-full">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50">
          <LoadingSpinner />
        </div>
      )}
      <div className="flex flex-col justify-center items-center w-full gap-2.25 pt-27.5">
        <h1 className="text-[3.125rem] leading-12.5 tracking-[-0.07em] text-primary-50 font-(family-name:--font-noto-sans-kr) font-extrabold">
          tolli
        </h1>
        <p className="text-[19px] leading-6.5 tracking-[-0.03em] text-[#E3E3E3]">
          하루 한 절, to holy
        </p>
      </div>
      <div className="flex-1" />
      <Image
        src="/tolli-logo.webp"
        alt="tolli"
        width={744}
        height={744}
        className="w-46.5 object-contain animate-float"
        priority
      />
      <div className="flex-1" />
      <div
        className="flex flex-col justify-center px-10.75 items-center gap-2.75 w-full"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {error && (
          <p className="text-red-400 text-[13px] text-center">{error}</p>
        )}
        <button
          type="button"
          onClick={requestKakaoLogin}
          className="w-full h-13.5 flex items-center justify-center gap-3 bg-[#FEE500] rounded-[20px]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C7.03 3 3 6.36 3 10.5c0 2.64 1.7 4.96 4.26 6.28L6.2 20.1a.4.4 0 0 0 .58.44L11 18.1c.33.03.66.04 1 .04 4.97 0 9-3.36 9-7.5S16.97 3 12 3z"
              fill="#000000"
            />
          </svg>
          <span className="text-[#000000] text-[14px] font-medium">
            카카오로 로그인
          </span>
        </button>

        <button
          type="button"
          onClick={requestGoogleLogin}
          className="w-full h-13.5 flex items-center justify-center gap-3 bg-white rounded-[20px]"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span className="text-[#1f1f1f] text-[14px] font-medium tracking-[0.25px]">
            Sign in with Google
          </span>
        </button>

        <button
          type="button"
          onClick={requestAppleLogin}
          className="w-full h-13.5 flex items-center justify-center gap-3 bg-black rounded-[20px]"
        >
          <svg width="18" height="20" viewBox="0 0 814 1000" fill="white">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.7-57.8-155.5-127.4C46 790.7 0 663.2 0 541.8c0-207.3 136-316.5 270-316.5 69.3 0 126.9 45.4 170.3 45.4 41.3 0 107.6-48.1 185.5-48.1 29.9 0 108.9 2.6 168.3 75.4zm-234.2-180.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
          </svg>
          <span className="text-white text-[14px] font-medium">
            Sign in with Apple
          </span>
        </button>
      </div>
    </div>
  );
}
