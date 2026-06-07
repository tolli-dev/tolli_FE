'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getMyCurrentVerse } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';

async function getTodayVerseId(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await getMyCurrentVerse(dataConnect, { today: today.toISOString() });
  const { lastCompletion } = result.data;

  if (lastCompletion.length > 0) return lastCompletion[0].verse.id + 1;
  return 1;
}

export default function StudyLoadingPage() {
  const router = useRouter();
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
    Promise.all([
      getTodayVerseId(),
      new Promise<void>((resolve) => setTimeout(resolve, 3000)),
    ]).then(([verseId]) => {
      router.push(`/study/${verseId}/0`);
    });
  }, [router]);

  return (
    <div className="relative flex flex-col flex-1 h-full items-center justify-center gap-11.25">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          borderRadius: `${cornerRadius}px`,
          padding: '5px',
          background: 'conic-gradient(from var(--angle), #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'border-spin 6s linear infinite',
        }}
      />
      <p className="text-[clamp(1.125rem,5.5vw,1.5rem)] leading-[clamp(2rem,8.5vw,2.125rem)] font-medium text-[#CCB5F0] text-center">
        두근두근 <br /> 오늘의 말씀은?
      </p>
      <Image src="/tolli1.webp" alt="Tolli" width={228} height={228} className="object-contain" />
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
