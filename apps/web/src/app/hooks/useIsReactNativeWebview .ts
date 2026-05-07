"use client";
import { useEffect, useState } from "react";

export function useIsReactNativeWebview() {
  const [isReactNativeWebview, setIsReactNativeWebview] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ReactNativeWebView)
      setIsReactNativeWebview(true);
  }, []);

  return isReactNativeWebview;
}
