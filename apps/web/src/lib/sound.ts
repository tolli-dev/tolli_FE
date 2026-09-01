function isNativeWebView() {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView;
}

// 네이티브 앱(WebView) 안에서는 소리 재생을 네이티브에 위임한다.
// 네이티브가 PLAY_SOUND 요청을 받아 play()를 호출한 직후 SOUND_PLAYED로 알려주므로,
// 그 왕복 시간을 딜레이로 기록한다(브리지 왕복 시간 포함, 순수 재생 시작 시간은 아님).
export function requestNativeSound(src: string) {
  const t0 = performance.now();

  const handler = (e: MessageEvent) => {
    try {
      const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (data.type === 'SOUND_PLAYED' && data.src === src) {
        console.log(`[sound delay][native] ${src}: ${(performance.now() - t0).toFixed(1)}ms`);
        window.removeEventListener('message', handler);
        document.removeEventListener('message', handler as unknown as EventListener);
      }
    } catch {}
  };

  window.addEventListener('message', handler);
  document.addEventListener('message', handler as unknown as EventListener);

  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'PLAY_SOUND', src }));
}

export function playSound(src: string) {
  if (typeof window === 'undefined') return;

  if (isNativeWebView()) {
    requestNativeSound(src);
    return;
  }

  const audio = new Audio(encodeURI(src));

  const t0 = performance.now();
  audio.addEventListener(
    'playing',
    () => {
      console.log(`[sound delay] ${src}: ${(performance.now() - t0).toFixed(1)}ms`);
    },
    { once: true },
  );

  audio.play().catch(() => {});
}
