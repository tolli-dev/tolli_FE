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
    if (!window.ReactNativeWebView) {
      const t = setTimeout(() => {
        /* 재시도 로직 */
      }, 100);
      return () => clearTimeout(t);
    }

    let received = false;

    const handler = async (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        alert("DEBUG: 메시지 수신 " + JSON.stringify(data)); // TODO: 디버그 후 제거
        if (data.type !== "APP_VERSION") return;
        received = true;
        const { minVersion } = await fetch("/api/app/config").then((r) =>
          r.json(),
        );
        const result = isBelow(data.version, minVersion[data.platform]);
        alert(
          "DEBUG: version=" +
            data.version +
            " platform=" +
            data.platform +
            " min=" +
            JSON.stringify(minVersion) +
            " needUpdate=" +
            result,
        ); // TODO: 디버그 후 제거
        setNeedUpdate(result);
      } catch (err) {
        alert("DEBUG: handler 예외 " + String(err)); // TODO: 디버그 후 제거
      }
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
      alert("DEBUG: 2초 경과, received=" + received); // TODO: 디버그 후 제거
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
