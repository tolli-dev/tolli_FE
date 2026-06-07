let audio: HTMLAudioElement | null = null;

export function playSound(src: string) {
  if (typeof window === "undefined") return;
  if (!audio) {
    audio = new Audio(src);
    audio.preload = "auto";
  }
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
