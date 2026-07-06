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
    if (typeof window === "undefined" || !window.ReactNativeWebView) return;

    let received = false;

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

    window.addEventListener("message", handler);
    document.addEventListener("message", handler as unknown as EventListener);

    const request = () => {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "GET_APP_VERSION" }),
      );
    };

    request();
    const retryTimer = setTimeout(() => {
      if (!received) request();
    }, 800);

    const decideTimer = setTimeout(() => {
      if (!received) setNeedUpdate(true);
    }, 2000);

    return () => {
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
