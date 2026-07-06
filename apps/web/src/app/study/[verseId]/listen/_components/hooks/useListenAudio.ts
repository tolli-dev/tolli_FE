'use client';

import { useState, useEffect, useRef } from 'react';

export function useListenAudio(verseId: number) {
  const [played, setPlayed] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const verseAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof Audio === 'undefined') return;

    const verse = new Audio();
    const bgm = new Audio('/verse-audio/bgm.mp3');
    verseAudioRef.current = verse;
    bgmAudioRef.current = bgm;

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
      bgm.src = '';
      verse.pause();
      verse.src = '';
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
      audio.play().catch(() => {});
      setPlayed(true);
      setShowHome(true);

      audio.onended = () => {
        setPlayed(false);
      };
    }
  };

  const stopAll = () => {
    bgmAudioRef.current?.pause();
    verseAudioRef.current?.pause();
    setPlayed(false);
  };

  return { played, showHome, toggle, stopAll };
}
