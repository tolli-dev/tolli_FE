import { useCallback, useEffect, useRef, useState } from 'react';

export type PermissionStep = 'notification' | 'mic' | 'granted';

interface UseOnboardingPermissionsResult {
  step: PermissionStep;
  needSettings: boolean;
  blocked: boolean;
  isNative: boolean;
  initGate: () => void;
  requestNotification: () => void;
  requestMic: () => void;
  openAppSettings: () => void;
}

function postToNative(payload: Record<string, unknown>): void {
  window.ReactNativeWebView?.postMessage(JSON.stringify(payload));
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function useOnboardingPermissions(
  onAllGranted: () => void,
): UseOnboardingPermissionsResult {
  const [step, setStep] = useState<PermissionStep>('notification');
  const [needSettings, setNeedSettings] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const isNative =
    typeof window !== 'undefined' && Boolean(window.ReactNativeWebView);

  const onAllGrantedRef = useRef(onAllGranted);
  onAllGrantedRef.current = onAllGranted;

  const stepRef = useRef<PermissionStep>(step);
  stepRef.current = step;

  const needSettingsRef = useRef(needSettings);
  needSettingsRef.current = needSettings;

  const initRef = useRef(false);

  const advanceToMic = useCallback(() => {
    setStep('mic');
    setNeedSettings(false);
    setBlocked(false);
  }, []);

  const completeAll = useCallback(() => {
    setStep('granted');
    setNeedSettings(false);
    setBlocked(false);
    onAllGrantedRef.current();
  }, []);

  const requestNotification = useCallback(() => {
    setNeedSettings(false);
    setBlocked(false);
    postToNative({ type: 'REQUEST_NOTIFICATION_PERMISSION' });
  }, []);

  const requestMic = useCallback(async () => {
    setNeedSettings(false);
    setBlocked(false);

    if (isIOS()) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        completeAll();
      } catch {
        setNeedSettings(true);
      }
      return;
    }

    postToNative({ type: 'RECORD_READY' });
  }, [completeAll]);

  const initGate = useCallback(() => {
    if (!isNative) {
      completeAll();
      return;
    }
    initRef.current = true;
    postToNative({ type: 'QUERY_PERMISSION_STATUS' });
  }, [isNative, completeAll]);

  useEffect(() => {
    if (!isNative) return;

    const handleMessage = (e: MessageEvent | Event) => {
      const raw = (e as MessageEvent).data;
      if (typeof raw !== 'string') return;

      let data: { type?: string; [key: string]: unknown };
      try {
        data = JSON.parse(raw);
      } catch {
        return;
      }

      if (data.type === 'NOTIFICATION_PERMISSION_RESULT') {
        if (data.granted) {
          advanceToMic();
          if (!isIOS()) requestMic();
        } else {
          setNeedSettings(true);
        }
        return;
      }

      if (data.type === 'RECORD_PERMISSION') {
        if (data.status === 'granted') {
          completeAll();
        } else {
          setBlocked(data.status === 'blocked');
          setNeedSettings(true);
        }
        return;
      }

      if (data.type === 'PERMISSION_STATUS') {
        const notificationGranted = Boolean(data.notificationGranted);
        const micGranted = Boolean(data.micGranted);
        const isInit = initRef.current;
        initRef.current = false;

        if (notificationGranted && micGranted) {
          completeAll();
        } else if (isInit) {
          if (!notificationGranted) {
            setStep('notification');
            requestNotification();
          } else {
            advanceToMic();
            if (!isIOS()) requestMic();
          }
        } else if (notificationGranted && stepRef.current !== 'mic') {
          advanceToMic();
        } else if (!notificationGranted && stepRef.current === 'mic') {
          setStep('notification');
          setNeedSettings(true);
          setBlocked(false);
        } else {
          setNeedSettings(true);
        }
        return;
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as EventListener);

    const handleVisibility = () => {
      if (
        document.visibilityState === 'visible' &&
        stepRef.current !== 'granted' &&
        needSettingsRef.current
      ) {
        initRef.current = true;
        postToNative({ type: 'QUERY_PERMISSION_STATUS' });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as EventListener);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isNative, advanceToMic, completeAll, requestNotification, requestMic]);

  const openAppSettings = useCallback(() => {
    postToNative({ type: 'OPEN_APP_SETTINGS' });
  }, []);

  return {
    step,
    needSettings,
    blocked,
    isNative,
    initGate,
    requestNotification,
    requestMic,
    openAppSettings,
  };
}
