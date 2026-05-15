"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KakaoLoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.ReactNativeWebView) {
        window.location.href = "tolli://";
      } else {
        router.push('/terms');
      }
    }
  }, [router]);

  return (
    <>
      <p>로그인 중...</p>
    </>
  );
}
