import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from "expo-audio";

// 웹(WebView)에서 보내는 경로 → 번들된 네이티브 에셋 매핑.
// 파일명에 공백/한글/괄호가 있으면 Metro require가 불안정하므로 슬러그로 복사해 사용한다.
const SOUND_ASSETS: Record<string, number> = {
  "/sounds/정답.mp3": require("../assets/sounds/correct.mp3"),
  "/sounds/오답.mp3": require("../assets/sounds/wrong.mp3"),
  "/sounds/타자소리 타이핑 소리.mp3": require("../assets/sounds/typing.mp3"),
  "/sounds/다음탭 이동.mp3": require("../assets/sounds/tab-next.mp3"),
  "/sounds/보기 탭.mp3": require("../assets/sounds/tab-view.mp3"),
  "/sounds/말씀 잠깐 보기 카드 공개_비공개.mp3": require("../assets/sounds/card-flip.mp3"),
  "/sounds/말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3": require("../assets/sounds/card-flip-hint.mp3"),
  "/sounds/원래 화면 다시 돌아갈때.mp3": require("../assets/sounds/back.mp3"),
  "/sounds/어디론가 추가되었을때.mp3": require("../assets/sounds/added.mp3"),
  "/sounds/tolli에게 먹이가 전해졌을때.mp3": require("../assets/sounds/feed.mp3"),
  "/sounds/말씀 step 7까지 다 완료.mp3": require("../assets/sounds/complete.mp3"),
  "/sounds/네비게이션 오른쪽 스와이프.mp3": require("../assets/sounds/swipe-right.mp3"),
  "/sounds/네비게이션 왼쪽 스와이프.mp3": require("../assets/sounds/swipe-left.mp3"),
  "/sounds/step (0-7) x누르고 진짜 나감 (초기화).mp3": require("../assets/sounds/exit-reset.mp3"),
  "/sounds/step (0-7) x누르고 다시 돌아감.mp3": require("../assets/sounds/exit-back.mp3"),
};

const players: Record<string, AudioPlayer> = {};
let initialized = false;

// 앱 시작 시 1회 호출한다.
// iOS 무음 스위치와 무관하게 효과음이 들리도록 재생 카테고리로 설정하고,
// 모든 효과음을 미리 로드해 클릭 즉시 지연 없이 재생할 수 있게 한다.
export async function initSounds() {
  if (initialized) return;
  initialized = true;

  await setAudioModeAsync({ playsInSilentMode: true });

  Object.entries(SOUND_ASSETS).forEach(([src, asset]) => {
    players[src] = createAudioPlayer(asset);
  });
}

// 웹에서 전달한 경로의 효과음을 즉시 재생한다.
export function playSound(src: string) {
  const player = players[src];
  if (!player) return;

  player.seekTo(0); // 연타 시 처음부터
  player.play();
}
