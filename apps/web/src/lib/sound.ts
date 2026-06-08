const cache: Record<string, HTMLAudioElement> = {};

export function playSound(src: string) {
  if (typeof window === "undefined") return;

  let audio = cache[src];
  if (!audio) {
    audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    cache[src] = audio;
  }

  audio.currentTime = 0; // 연타 시 처음부터
  audio.play().catch(() => {});
}
