'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function RecordIntroPage() {
  const router = useRouter();
  const { verseId } = useParams<{ verseId: string }>();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/study/${verseId}/7`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, verseId]);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#DEDEDE]">
      <div className="flex-1" />
      <div className="flex flex-col items-center">
        <p className="text-[1.5rem] leading-8.5 font-semibold text-[#1B1B1B] text-center mb-13.5">
          마지막 단계!
          <br /> 이제 직접 입으로 말씀을
          <br /> 외쳐보세요!
        </p>
        <img src="/TolliLastStep.svg" alt="tolli" className="w-full" />
      </div>
    </div>
  );
}
