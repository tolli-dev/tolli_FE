'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useDeviceCornerRadius } from '@/hooks/useDeviceCornerRadius';

export default function RecordIntroPage() {
  const router = useRouter();
  const { verseId } = useParams<{ verseId: string }>();
  const cornerRadius = useDeviceCornerRadius();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/study/${verseId}/7`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router, verseId]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #CCB5F0 0%, #FFFFFF 100%)' }} />
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
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[1.5rem] leading-8.5 font-semibold text-[#1B1B1B] text-center">
          마지막 단계!
          <br /> 이제 직접 입으로 말씀을
          <br /> 외쳐보세요!
        </p>
      </div>
      <Image src="/TolliLastStep.webp" alt="tolli" width={1080} height={1080} className="relative -z-10 w-full h-auto" priority style={{ animation: 'slide-up 0.4s ease forwards' }} />
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
