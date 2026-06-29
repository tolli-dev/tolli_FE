'use client';

import { useState, useEffect, useRef } from 'react';

export function useListenAudio(verseId: number) {
  const [played, setPlayed] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const verseAudioRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio() : null,
  );
  const bgmAudioRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio('/verse-audio/bgm.mp3') : null,
  );

  useEffect(() => {
    const bgm = bgmAudioRef.current;
    if (!bgm) return;

    bgm.loop = true;
    bgm.volume = 0.7;

    // RN WebView injectJavaScript로 autoplay 정책 우회
    (window as Window & { __startBGM?: () => void }).__startBGM = () => {
      bgm.play().catch(() => {});
    };

    // 웹 브라우저 직접 접근 시 폴백
    bgm.play().catch(() => {});

    return () => {
      bgm.pause();
      verseAudioRef.current?.pause();
      delete (window as Window & { __startBGM?: () => void }).__startBGM;
    };
  }, []);

  const toggle = () => {
    const audio = verseAudioRef.current;
    if (!audio) return;

    if (played) {
      audio.pause();
      setPlayed(false);
    } else {
      audio.src = `/verse-audio/verses/${verseId}.mp3`;
      audio.play();
      setPlayed(true);
      setShowHome(true);

      audio.onended = () => {
        setPlayed(false);
      };
    }
  };

  return { played, showHome, toggle };
}
