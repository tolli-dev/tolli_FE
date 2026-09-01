import { Platform } from "react-native";
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";
import { File, Paths } from "expo-file-system";

// 웹의 apps/web/public/sounds와 동일한 파일명을 키로 사용한다.
// 웹에서 postMessage로 보내는 src(예: '/sounds/보기 탭.mp3')의 파일명 부분과 매칭된다.
//
// mp3는 require()로 불러오지 않고 네이티브 번들 리소스로 직접 참조한다.
// Metro 개발 서버가 에셋을 '/assets/?unstable_path=...' 쿼리 URL로 서빙하는데,
// 한글/공백이 섞인 파일명에서 이 경로가 해석되지 않아 재생이 실패하기 때문이다.
// 복사와 이름 규칙은 plugins/withBundledSounds.js가 담당한다.
const SOUND_FILES = [
  "step (0-7) x누르고 다시 돌아감.mp3",
  "step (0-7) x누르고 진짜 나감 (초기화).mp3",
  "step (0-7) x누름.mp3",
  "tolli에게 먹이가 전해졌을때.mp3",
  "끄기 소리.mp3",
  "나가기 버튼 눌렀을때 후보1.mp3",
  "네비게이션 오른쪽 스와이프.mp3",
  "네비게이션 왼쪽 스와이프.mp3",
  "다음탭 이동.mp3",
  "말씀 step 7까지 다 완료.mp3",
  "말씀 잠깐 보기 카드 공개_비공개.mp3",
  "말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3",
  "보기 탭 오답 후보2.mp3",
  "보기 탭 오답.mp3",
  "보기 탭.mp3",
  "어디론가 추가되었을때.mp3",
  "오답.mp3",
  "원래 화면 다시 돌아갈때.mp3",
  "정답.mp3",
  "처음 말씀 pop up 될때 소리.mp3",
  "타자소리 타이핑 소리.mp3",
];

// plugins/withBundledSounds.js의 resourceName()과 반드시 같은 값을 만들어야 한다.
// (빌드 시 복사되는 파일명 = 런타임에 찾는 이름)
// sha1은 RN 런타임에 없으므로, 빌드 타임에 생성된 표를 그대로 쓴다.
const RESOURCE_NAMES: Record<string, string> = {
  "step (0-7) x누르고 다시 돌아감.mp3": "snd_d56b40a349da",
  "step (0-7) x누르고 진짜 나감 (초기화).mp3": "snd_9d5354c2f6e0",
  "step (0-7) x누름.mp3": "snd_eec2d34b8d60",
  "tolli에게 먹이가 전해졌을때.mp3": "snd_f3a2a141c28f",
  "끄기 소리.mp3": "snd_595080497e36",
  "나가기 버튼 눌렀을때 후보1.mp3": "snd_713f9d3cc86f",
  "네비게이션 오른쪽 스와이프.mp3": "snd_f32c546870f6",
  "네비게이션 왼쪽 스와이프.mp3": "snd_108e8da53890",
  "다음탭 이동.mp3": "snd_0c97dc3e7546",
  "말씀 step 7까지 다 완료.mp3": "snd_ea4c22c9c35e",
  "말씀 잠깐 보기 카드 공개_비공개.mp3": "snd_be5eb715a1b9",
  "말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3": "snd_44431e1d6b92",
  "보기 탭 오답 후보2.mp3": "snd_16cb9a721e90",
  "보기 탭 오답.mp3": "snd_b1d8f94da66e",
  "보기 탭.mp3": "snd_189c82fde44b",
  "어디론가 추가되었을때.mp3": "snd_9732954c0440",
  "오답.mp3": "snd_b3cd3ed828c9",
  "원래 화면 다시 돌아갈때.mp3": "snd_056abdc8b04c",
  "정답.mp3": "snd_5c9d415c85d3",
  "처음 말씀 pop up 될때 소리.mp3": "snd_25ed9b4e9dda",
  "타자소리 타이핑 소리.mp3": "snd_f4257b23c2a4",
};

// iOS는 앱 번들 안의 실제 파일을 file:// 경로로 열고,
// Android는 res/raw 리소스를 확장자 없는 이름으로 참조한다.
function sourceFor(fileName: string): string | null {
  const name = RESOURCE_NAMES[fileName];
  if (!name) return null;
  // Android: res/raw 는 확장자 없는 리소스 이름으로 참조한다.
  // iOS: 앱 번들 최상위에 복사된 실제 파일을 가리켜야 한다.
  return Platform.OS === "android"
    ? name
    : new File(Paths.bundle, `${name}.mp3`).uri;
}

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

  for (const fileName of SOUND_FILES) {
    const source = sourceFor(fileName);
    if (!source) continue;
    players[fileName] = createAudioPlayer(source);
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
