'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/afterLogin/step1');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-full">
      <h1 className="text-h1">가입 완료!</h1>
      <p className="text-h2 text-surface-200 mt-2">잠깐, 소개할 친구가 있어요</p>
      <div className="mt-8" style={{ width: 197, height: 197 }}>
        <svg
          width="197"
          height="197"
          viewBox="0 0 197 197"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: 'spin 3s linear infinite' }}
        >
          <defs>
            <linearGradient
              id="welcome-ring-gradient"
              x1="-17.3459"
              y1="-9.29245"
              x2="197"
              y2="119.563"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="#CCB5F0" />
            </linearGradient>
          </defs>
          <circle
            cx="98.5"
            cy="98.5"
            r="93"
            stroke="url(#welcome-ring-gradient)"
            strokeWidth="11"
          />
        </svg>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
