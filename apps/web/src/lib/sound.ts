const cache: Record<string, HTMLAudioElement> = {};

const ALL_SOUNDS = [
  "/sounds/정답.mp3",
  "/sounds/오답.mp3",
  "/sounds/타자소리 타이핑 소리.mp3",
  "/sounds/다음탭 이동.mp3",
  "/sounds/보기 탭.mp3",
  "/sounds/말씀 잠깐 보기 카드 공개_비공개.mp3",
  "/sounds/말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3",
  "/sounds/원래 화면 다시 돌아갈때.mp3",
  "/sounds/어디론가 추가되었을때.mp3",
  "/sounds/tolli에게 먹이가 전해졌을때.mp3",
  "/sounds/말씀 step 7까지 다 완료.mp3",
  "/sounds/네비게이션 오른쪽 스와이프.mp3",
  "/sounds/네비게이션 왼쪽 스와이프.mp3",
  "/sounds/step (0-7) x누르고 진짜 나감 (초기화).mp3",
  "/sounds/step (0-7) x누르고 다시 돌아감.mp3",
];

export function preloadSounds() {
  if (typeof window === "undefined") return;
  ALL_SOUNDS.forEach((src) => {
    if (cache[src]) return;
    const audio = new Audio(encodeURI(src));
    audio.preload = "auto";
    cache[src] = audio;
  });
}

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
