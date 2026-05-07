'use client';

import { useEffect } from 'react';
import { signInWithAppleToken, signInWithGoogleToken } from '@/firebase/fireAuth';
import { useRouter } from 'next/navigation';

const requestGoogleLogin = () => {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'GOOGLE_LOGIN' }));
};

const requestAppleLogin = () => {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'APPLE_LOGIN' }));
};

export default function LoginPage() {
  const router = useRouter();

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
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        type="button"
        onClick={requestGoogleLogin}
        className="w-50 h-10 bg-amber-600 border-2 rounded cursor-pointer"
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
    </div>
  );
}
