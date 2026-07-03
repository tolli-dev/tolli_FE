import { useEffect } from 'react';

/**
 * 네이티브(WebView)에게 Expo Push 토큰을 요청하고,
 * 응답받은 토큰을 서버에 등록한다. (미완료자 리마인더 푸시용)
 * 대시보드는 로그인 이후 진입점이라 __session 쿠키가 보장된다.
 */
export function usePushToken(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined' || !window.ReactNativeWebView) return;

    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.type === 'EXPO_PUSH_TOKEN' && data.token) {
          fetch('/api/push/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: data.token, platform: data.platform }),
          }).catch(() => {});
        }
      } catch {}
    };

    window.addEventListener('message', handler);
    document.addEventListener('message', handler as unknown as EventListener);
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_EXPO_PUSH_TOKEN' }));

    return () => {
      window.removeEventListener('message', handler);
      document.removeEventListener('message', handler as unknown as EventListener);
    };
  }, [enabled]);
}
