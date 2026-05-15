"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IP_URL } from "@/constants/url";

export default function KakaoLoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // router.push(`${IP_URL}/onBoarding/afterLogin/step1`);
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "LOGIN_SUCCESS" }),
      );
      setTimeout(() => {
        window.location.href = "tolli://";
      }, 300);
      // window.location.href = "tolli://";
      // router.push(`${IP_URL}/onBoarding/afterLogin/step1`);
      // if (window.ReactNativeWebView) {
      //   window.location.href = "tolli://";
    }
  }, [router]);

  return (
    <>
      <p>로그인 중...</p>
    </>
  );
}
