"use client";

import { useEffect } from "react";

/**
 * 네이티브 스플래시를 안전하게 숨기기 위한 신호 컴포넌트.
 *
 * WebView 첫 진입 시 `env(safe-area-inset-*)`가 0 → 실제값으로 평가되며
 * 레이아웃이 한 번 흔들린다. 이 흔들림이 끝난(= 레이아웃 안정화) 뒤에
 * 네이티브로 SPLASH_READY를 보내, 네이티브가 그 시점에 스플래시를 숨기게 한다.
 *
 * requestAnimationFrame 2회: 1회차에 env() 평가 + 스타일 적용, 2회차에 그
 * 결과가 페인트된 프레임을 보장 → 흔들림이 스플래시 뒤에서 끝나도록 한다.
 */
export default function SplashReadySignal() {
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({ type: "SPLASH_READY" }),
        );
      });
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  return null;
}
