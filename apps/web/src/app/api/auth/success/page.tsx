"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IP_URL } from "@/constants/url";

export default function KakaoLoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.ReactNativeWebView) {
        window.location.href = "tolli://";
      } else {
        router.push(`${IP_URL}/main`);
      }
    }
  }, [router]);

  return (
    <>
      <p>로그인 중...</p>
    </>
  );
}
