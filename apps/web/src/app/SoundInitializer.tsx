"use client";

import { useEffect } from "react";
import { preloadSounds, unlockAudio } from "@/lib/sound";

// 앱에서 사용하는 사운드 목록. 초기화 시 미리 디코딩한다.
const SOUND_SRCS = [
  "/sounds/말씀 step 7까지 다 완료.mp3",
  "/sounds/step (0-7) x누르고 진짜 나감 (초기화).mp3",
  "/sounds/step (0-7) x누르고 다시 돌아감.mp3",
  "/sounds/타자소리 타이핑 소리.mp3",
  "/sounds/어디론가 추가되었을때.mp3",
  "/sounds/네비게이션 오른쪽 스와이프.mp3",
  "/sounds/네비게이션 왼쪽 스와이프.mp3",
  "/sounds/정답.mp3",
  "/sounds/오답.mp3",
  "/sounds/tolli에게 먹이가 전해졌을때.mp3",
  "/sounds/다음탭 이동.mp3",
  "/sounds/보기 탭.mp3",
  "/sounds/말씀 잠깐 보기 카드 공개_비공개.mp3",
  "/sounds/원래 화면 다시 돌아갈때.mp3",
  "/sounds/말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3",
];

export default function SoundInitializer() {
  useEffect(() => {
    preloadSounds(SOUND_SRCS);

    // iOS 오디오 잠금 해제는 사용자 제스처 안에서만 가능하므로
    // 최초 1회 입력에서 처리한다.
    const handleFirstGesture = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture);
    window.addEventListener("touchstart", handleFirstGesture);

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };
  }, []);

  return null;
}
