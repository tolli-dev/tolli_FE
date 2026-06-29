import { useState, useEffect } from 'react';

export function useDeviceCornerRadius(): number {
  const [cornerRadius, setCornerRadius] = useState(0);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.type === 'DEVICE_CORNER_RADIUS') {
          setCornerRadius(data.value ?? 0);
        }
      } catch {}
    };

    window.addEventListener('message', handler);
    document.addEventListener('message', handler as unknown as EventListener);
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'WEB_READY' }));

    return () => {
      window.removeEventListener('message', handler);
      document.removeEventListener('message', handler as unknown as EventListener);
    };
  }, []);

  return cornerRadius;
}
