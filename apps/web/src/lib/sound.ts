const cache: Record<string, HTMLAudioElement> = {};

export function playSound(src: string) {
  if (typeof window === "undefined") return;

  // 네이티브 WebView 안에서는 iOS 무음 스위치 대응과 저지연 재생을 위해
  // 웹에서 직접 재생하지 않고 네이티브(expo-audio)에 재생을 위임한다.
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "PLAY_SOUND", src }),
    );
    return;
  }

  let audio = cache[src];
  if (!audio) {
    audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    cache[src] = audio;
  }

  audio.currentTime = 0; // 연타 시 처음부터
  audio.play().catch(() => {});
}
