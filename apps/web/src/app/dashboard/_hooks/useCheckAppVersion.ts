import { useEffect, useState } from "react";

function isBelow(current?: string, minVersion?: string): boolean {
  if (!current || !minVersion) return false;

  const splittedCurrent = current.split(".").map(Number);
  const splittedMinVersion = minVersion.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (splittedCurrent[i] < splittedMinVersion[i]) return true;
    if (splittedCurrent[i] > splittedMinVersion[i]) return false;
  }
  return false;
}

export function useCheckAppVersion() {
  const [needUpdate, setNeedUpdate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    let received = false;
    let retryTimer: ReturnType<typeof setTimeout>;
    let decideTimer: ReturnType<typeof setTimeout>;
    let pollTimer: ReturnType<typeof setTimeout>;

    const handler = async (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.type !== "APP_VERSION") return;
        received = true;
        const { minVersion } = await fetch("/api/app/config").then((r) =>
          r.json(),
        );

        setNeedUpdate(isBelow(data.version, minVersion[data.platform]));
      } catch {}
    };

    const start = () => {
      window.addEventListener("message", handler);
      document.addEventListener("message", handler as unknown as EventListener);

      const request = () => {
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({ type: "GET_APP_VERSION" }),
        );
      };

      request();
      retryTimer = setTimeout(() => {
        if (!received) request();
      }, 800);

      decideTimer = setTimeout(() => {
        if (!received) setNeedUpdate(true);
      }, 2000);
    };

    const waitForRNWebView = (attempt: number) => {
      if (cancelled) return;
      if (window.ReactNativeWebView) {
        start();
        return;
      }
      if (attempt >= 20) return;
      pollTimer = setTimeout(() => waitForRNWebView(attempt + 1), 100);
    };

    waitForRNWebView(0);

    return () => {
      cancelled = true;
      clearTimeout(pollTimer);
      clearTimeout(retryTimer);
      clearTimeout(decideTimer);
      window.removeEventListener("message", handler);
      document.removeEventListener(
        "message",
        handler as unknown as EventListener,
      );
    };
  }, []);

  return needUpdate;
}
