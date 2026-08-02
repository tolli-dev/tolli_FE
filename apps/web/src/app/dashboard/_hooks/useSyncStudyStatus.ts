import { useEffect } from "react";

export function useSyncStudyStatus(done: boolean | null) {
  useEffect(() => {
    if (done === null) return;
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "SYNC_STUDY_STATUS", done }),
    );
  }, [done]);
}
