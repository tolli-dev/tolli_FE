'use client';

import { useEffect } from 'react';
import { signInWithGoogleToken } from '@/firebase/fireAuth';
import { useRouter } from 'next/navigation';

const requestGoogleLogin = () => {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'GOOGLE_LOGIN' }));
};

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const { type, token } = JSON.parse(e.data);
        if (type === 'AUTH_TOKEN' && token) {
          signInWithGoogleToken(token).then((user) => {
            router.push('/');
          });
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        type="button"
        onClick={requestGoogleLogin}
        className="w-50 h-10 bg-amber-600 border-2 rounded cursor-pointer"
      >
        구글로 로그인하기
      </button>
    </div>
  );
}
