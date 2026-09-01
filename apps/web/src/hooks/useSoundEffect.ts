'use client';

import { useCallback, useEffect, useRef } from 'react';
import { requestNativeSound } from '@/lib/sound';

function isNativeWebView() {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView;
}

export function useSoundEffect(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 네이티브 앱 안에서는 네이티브가 자체적으로 미리 로드해두므로 웹에서 또 받을 필요 없음
    if (isNativeWebView()) return;

    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.load();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(() => {
    if (isNativeWebView()) {
      requestNativeSound(src);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [src]);

  return play;
}
