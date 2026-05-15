'use client';

import { useEffect } from 'react';
import { signInWithAppleToken, signInWithGoogleToken } from '@/firebase/fireAuth';
import { useRouter } from 'next/navigation';
import { useIsReactNativeWebview } from '../hooks/useIsReactNativeWebview ';

export default function LoginPage() {
  const router = useRouter();
  const isWebView = useIsReactNativeWebview();

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;

    if (isWebView) {
      const message = JSON.stringify({
        type: 'KAKAO_LOGIN',
        url: KAKAO_AUTH_URL,
      });
      window?.ReactNativeWebView.postMessage(message);
    } else {
      window.location.href = KAKAO_AUTH_URL;
    }
  };

  const requestGoogleLogin = () => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'GOOGLE_LOGIN' }));
  };

  const requestAppleLogin = () => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'APPLE_LOGIN' }));
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const { type, token } = JSON.parse(e.data);
        if (type === 'GOOGLE_TOKEN' && token) {
          signInWithGoogleToken(token).then((user) => {
            router.push('/');
          });
        }
        if (type === 'APPLE_TOKEN' && token) {
          signInWithAppleToken(token).then((user) => {
            router.push('/');
          });
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as EventListener);
    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        type="button"
        onClick={requestGoogleLogin}
        className="w-50 h-1 border-2 rounded cursor-pointer"
      >
        구글로 로그인하기
      </button>
      <button
        type="button"
        onClick={requestAppleLogin}
        className="w-50 h-10 bg-black text-white border-2 rounded cursor-pointer"
      >
        애플로 로그인하기
      </button>
      <button onClick={handleKakaoLogin}>카카오톡으로 시작하기</button>
    </div>
  );
}
