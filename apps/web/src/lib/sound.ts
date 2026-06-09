let audioContext: AudioContext | null = null;
const bufferCache: Record<string, AudioBuffer> = {};
let unlocked = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  return audioContext;
}

// iOS는 AudioContext가 suspended 상태로 시작하므로
// 최초 사용자 제스처에서 1회 호출해 잠금을 해제한다.
export function unlockAudio() {
  const ctx = getAudioContext();
  if (!ctx || unlocked) return;

  ctx.resume().catch(() => {});

  const source = ctx.createBufferSource();
  source.buffer = ctx.createBuffer(1, 1, 22050); // 무음 1프레임
  source.connect(ctx.destination);
  source.start(0);

  unlocked = true;
}

async function loadBuffer(src: string): Promise<AudioBuffer | null> {
  const ctx = getAudioContext();
  if (!ctx) return null;
  if (bufferCache[src]) return bufferCache[src];

  const res = await fetch(encodeURI(src));
  const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
  bufferCache[src] = buffer;
  return buffer;
}

// 앱 초기화 시 사용할 사운드들을 미리 디코딩해 캐싱한다.
export function preloadSounds(srcs: string[]) {
  srcs.forEach((src) => {
    loadBuffer(src).catch(() => {});
  });
}

export function playSound(src: string) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const play = (buffer: AudioBuffer) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  };

  const cached = bufferCache[src];
  if (cached) {
    play(cached);
    return;
  }

  loadBuffer(src)
    .then((buffer) => {
      if (buffer) play(buffer);
    })
    .catch(() => {});
}
