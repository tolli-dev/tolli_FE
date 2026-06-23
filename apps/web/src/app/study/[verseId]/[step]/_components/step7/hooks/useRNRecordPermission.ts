import { useCallback, useEffect, useRef, useState } from 'react';

export function useRNRecordPermission(onGranted: () => void) {
  const [needSettings, setNeedSettings] = useState(false);
  const onGrantedRef = useRef(onGranted);
  onGrantedRef.current = onGranted;

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string') return;
      try {
        const { type, status } = JSON.parse(e.data);
        if (type === 'RECORD_PERMISSION') {
          if (status === 'granted') {
            setNeedSettings(false);
            onGrantedRef.current();
          } else {
            setNeedSettings(true);
          }
        }
      } catch {
        // RN 외 메시지 무시
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as EventListener);
    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as EventListener);
    };
  }, []);

  const requestPermission = useCallback(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'RECORD_READY' }));
    } else {
      onGrantedRef.current();
    }
  }, []);

  const openAppSettings = useCallback(() => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'OPEN_APP_SETTINGS' }));
  }, []);

  const triggerNeedSettings = useCallback(() => setNeedSettings(true), []);
  const clearNeedSettings = useCallback(() => setNeedSettings(false), []);

  return { needSettings, requestPermission, openAppSettings, triggerNeedSettings, clearNeedSettings };
}
