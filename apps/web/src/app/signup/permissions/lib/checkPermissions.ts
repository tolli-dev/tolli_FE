function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isNative(): boolean {
  return typeof window !== 'undefined' && Boolean(window.ReactNativeWebView);
}

function queryNativePermissionStatus(): Promise<{
  notificationGranted: boolean;
  micGranted: boolean;
}> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve({ notificationGranted: false, micGranted: false });
    }, 3000);

    const handleMessage = (e: MessageEvent | Event) => {
      const raw = (e as MessageEvent).data;
      if (typeof raw !== 'string') return;
      try {
        const data = JSON.parse(raw);
        if (data.type === 'PERMISSION_STATUS') {
          cleanup();
          resolve({
            notificationGranted: Boolean(data.notificationGranted),
            micGranted: Boolean(data.micGranted),
          });
        }
      } catch {
        // ignore
      }
    };

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as EventListener);
    }

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as EventListener);
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'QUERY_PERMISSION_STATUS' }));
  });
}

async function isMicGrantedIOS(): Promise<boolean> {
  try {
    const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    if (status.state === 'granted') return true;
    if (status.state === 'denied') return false;
  } catch {
    // permissions.query 미지원 → getUserMedia로 판별
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

export async function hasAllPermissions(): Promise<boolean> {
  if (!isNative()) return true;

  const { notificationGranted, micGranted } = await queryNativePermissionStatus();
  if (!notificationGranted) return false;

  if (isIOS()) return isMicGrantedIOS();
  return micGranted;
}
