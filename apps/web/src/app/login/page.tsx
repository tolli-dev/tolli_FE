'use client';

import { useEffect } from 'react';
import { signInWithGoogleToken } from '@/firebase/fireAuth';

const requestGoogleLogin = () => {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'GOOGLE_LOGIN' }));
};

export default function LoginPage() {
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const { type, token } = JSON.parse(e.data);
        if (type === 'AUTH_TOKEN' && token) {
          signInWithGoogleToken(token).then((user) => {
            window.location.href = '/';
          });
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={requestGoogleLogin}
        className="mt-40 w-50 h-10 bg-amber-600 border-2 rounded cursor-pointer"
      >
        구글로 로그인하기
      </button>
    </div>
  );
}
