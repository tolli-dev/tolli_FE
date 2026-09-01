function isNativeWebView() {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView;
}

// 네이티브 앱(WebView) 안에서는 소리 재생을 네이티브에 위임한다.
export function requestNativeSound(src: string) {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'PLAY_SOUND', src }));
}

export function playSound(src: string) {
  if (typeof window === 'undefined') return;

  if (isNativeWebView()) {
    requestNativeSound(src);
    return;
  }

  const audio = new Audio(encodeURI(src));
  audio.play().catch(() => {});
}
