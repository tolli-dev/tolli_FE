import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";

// 웹의 apps/web/public/sounds와 동일한 파일명을 키로 사용한다.
// 웹에서 postMessage로 보내는 src(예: '/sounds/보기 탭.mp3')의 파일명 부분과 매칭된다.
const SOUND_ASSETS: Record<string, number> = {
  "step (0-7) x누르고 다시 돌아감.mp3": require("./assets/sounds/step (0-7) x누르고 다시 돌아감.mp3"),
  "step (0-7) x누르고 진짜 나감 (초기화).mp3": require("./assets/sounds/step (0-7) x누르고 진짜 나감 (초기화).mp3"),
  "step (0-7) x누름.mp3": require("./assets/sounds/step (0-7) x누름.mp3"),
  "tolli에게 먹이가 전해졌을때.mp3": require("./assets/sounds/tolli에게 먹이가 전해졌을때.mp3"),
  "끄기 소리.mp3": require("./assets/sounds/끄기 소리.mp3"),
  "나가기 버튼 눌렀을때 후보1.mp3": require("./assets/sounds/나가기 버튼 눌렀을때 후보1.mp3"),
  "네비게이션 오른쪽 스와이프.mp3": require("./assets/sounds/네비게이션 오른쪽 스와이프.mp3"),
  "네비게이션 왼쪽 스와이프.mp3": require("./assets/sounds/네비게이션 왼쪽 스와이프.mp3"),
  "다음탭 이동.mp3": require("./assets/sounds/다음탭 이동.mp3"),
  "말씀 step 7까지 다 완료.mp3": require("./assets/sounds/말씀 step 7까지 다 완료.mp3"),
  "말씀 잠깐 보기 카드 공개_비공개.mp3": require("./assets/sounds/말씀 잠깐 보기 카드 공개_비공개.mp3"),
  "말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3": require("./assets/sounds/말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3"),
  "보기 탭 오답 후보2.mp3": require("./assets/sounds/보기 탭 오답 후보2.mp3"),
  "보기 탭 오답.mp3": require("./assets/sounds/보기 탭 오답.mp3"),
  "보기 탭.mp3": require("./assets/sounds/보기 탭.mp3"),
  "어디론가 추가되었을때.mp3": require("./assets/sounds/어디론가 추가되었을때.mp3"),
  "오답.mp3": require("./assets/sounds/오답.mp3"),
  "원래 화면 다시 돌아갈때.mp3": require("./assets/sounds/원래 화면 다시 돌아갈때.mp3"),
  "정답.mp3": require("./assets/sounds/정답.mp3"),
  "처음 말씀 pop up 될때 소리.mp3": require("./assets/sounds/처음 말씀 pop up 될때 소리.mp3"),
  "타자소리 타이핑 소리.mp3": require("./assets/sounds/타자소리 타이핑 소리.mp3"),
};

const players: Record<string, AudioPlayer> = {};
let preloaded = false;

export async function preloadSounds() {
  if (preloaded) return;
  preloaded = true;

  // 효과음/UI 사운드는 오디오 포커스를 요청하지 않고 겹쳐 재생되도록 한다.
  // 기본값(포커스 요청)으로 두면 짧은 시간에 여러 소리가 겹칠 때
  // 포커스 협상 과정에서 뒤에 재생 요청한 소리가 씹히거나 아예 안 들릴 수 있다.
  await setAudioModeAsync({
    interruptionMode: "mixWithOthers",
    playsInSilentMode: true,
  });

  for (const [name, asset] of Object.entries(SOUND_ASSETS)) {
    players[name] = createAudioPlayer(asset);
  }
}

// src는 웹에서 온 '/sounds/파일명.mp3' 형태의 경로. 파일명만 뽑아 매칭한다.
// seekTo는 비동기라 기다리지 않고 play()를 호출하면 탐색이 끝나기 전에
// 재생이 시작돼 앞부분이 잘려 들리는 레이스 컨디션이 생긴다.
export async function playSoundBySrc(src: string) {
  const name = decodeURIComponent(src).split("/").pop();
  if (!name) return;
  const player = players[name];
  if (!player) return;
  await player.seekTo(0);
  player.play();
}
