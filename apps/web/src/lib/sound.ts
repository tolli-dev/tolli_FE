export function playSound(src: string) {
  if (typeof window === "undefined") return;
  const audio = new Audio(encodeURI(src));
  audio.play().catch(() => {});
}
