import { useEffect, useState } from "react";

function isBelow(current: string, minVersion: string): boolean {
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
    const handler = async (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.type !== "APP_VERSION") return;
        const { minVersion } = await fetch("/api/app/config").then((r) =>
          r.json(),
        );
        if (isBelow(data.version, minVersion[data.platform]))
          setNeedUpdate(true);
      } catch {}
    };

    window.addEventListener("message", handler);
    document.addEventListener("message", handler as unknown as EventListener);

    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "GET_APP_VERSION" }),
    );
    return () => {
      window.removeEventListener("message", handler);
      document.removeEventListener(
        "message",
        handler as unknown as EventListener,
      );
    };
  }, []);

  return needUpdate;
}
