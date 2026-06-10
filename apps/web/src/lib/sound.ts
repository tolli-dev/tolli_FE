const cache: Record<string, HTMLAudioElement> = {};

export function playSound(src: string) {
  if (typeof window === "undefined") return;

  // 네이티브 WebView 안에서도 브리지 지연/안드로이드 연타 문제를 피하기 위해
  // HTMLAudioElement로 직접 재생한다. (단, iOS 무음 스위치 상태에서는 들리지 않는다.)
  let audio = cache[src];
  if (!audio) {
    audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    cache[src] = audio;
  }

  audio.currentTime = 0; // 연타 시 처음부터
  audio.play().catch(() => {});
}
