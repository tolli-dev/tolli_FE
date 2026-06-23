'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useDeviceCornerRadius } from '@/hooks/useDeviceCornerRadius';

export default function Step2IntroPage() {
  const router = useRouter();
  const { verseId } = useParams<{ verseId: string }>();
  const cornerRadius = useDeviceCornerRadius();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/study/${verseId}/2`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router, verseId]);

  return (
    <div className="relative flex flex-col flex-1 h-full items-center justify-center gap-11.25">
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, #CCB5F0 0%, #FFFFFF 100%)' }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          borderRadius: `${Math.round(cornerRadius * 0.95)}px`,
          padding: '5px',
          background: 'conic-gradient(from var(--angle), #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'border-spin 6s linear infinite',
        }}
      />
      <p className="text-[1.5rem] leading-8.5 font-medium text-[#1A1A1A] text-center">
        굿! <br /> 이제 빈칸을 맞춰주세요
      </p>
      <Image src="/tolli1.webp" alt="Tolli" width={228} height={228} className="object-contain" priority />
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
