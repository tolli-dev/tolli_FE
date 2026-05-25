'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function RecallIntroPage() {
  const router = useRouter();
  const { verseId } = useParams<{ verseId: string }>();
  const [cornerRadius, setCornerRadius] = useState(0);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.type === 'DEVICE_CORNER_RADIUS') {
          setCornerRadius(data.value ?? 0);
        }
      } catch {}
    };
    window.addEventListener('message', handler);
    document.addEventListener('message', handler as unknown as EventListener);

    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'WEB_READY' }));

    return () => {
      window.removeEventListener('message', handler);
      document.removeEventListener('message', handler as unknown as EventListener);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/study/${verseId}/6`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, verseId]);

  return (
    <div className="relative flex flex-col flex-1 h-full items-center justify-center gap-11.25">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          borderRadius: `${cornerRadius}px`,
          padding: '3px',
          background: 'conic-gradient(from var(--angle), white, #CCB5F0, white)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'border-spin 3s linear infinite',
        }}
      />
      <p className="text-[1.5rem] leading-8.5 font-medium text-[#CCB5F0] text-center">
        두근두근 <br /> 오늘의 말씀은?
      </p>
      <img src="/tolli1.svg" alt="Tolli" className="w-57 h-57 object-contain" />
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
      `}</style>
    </div>
  );
}
