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

    const start = () => {
      window.addEventListener("message", handler);
      document.addEventListener(
        "message",
        handler as unknown as EventListener,
      );

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
        alert("DEBUG: 2초 경과, received=" + received); // TODO: 디버그 후 제거
        if (!received) setNeedUpdate(true);
      }, 2000);
    };

    // window.ReactNativeWebView가 마운트 시점에 아직 주입되지 않았을 수 있어
    // 100ms 간격으로 최대 2초간 재확인한다.
    const waitForRNWebView = (attempt: number) => {
      if (cancelled) return;
      if (window.ReactNativeWebView) {
        alert("DEBUG: RNWebView 감지됨 (시도 " + attempt + "회)"); // TODO: 디버그 후 제거
        start();
        return;
      }
      if (attempt >= 20) {
        alert("DEBUG: RNWebView 끝내 감지 안 됨 (2초 대기 후 포기)"); // TODO: 디버그 후 제거
        return;
      }
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
