'use client';
import { handleGoogleLogin } from '@/firebase/fireAuth';

export default function LoginPage() {
  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mt-40 w-50 h-10 bg-amber-600 border-2 rounded cursor-pointer"
      >
        구글로 로그인하기
      </button>
    </div>
  );
}
