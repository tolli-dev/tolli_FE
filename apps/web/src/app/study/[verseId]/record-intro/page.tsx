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
    <div className="flex flex-col flex-1 items-center justify-center">
      <p className="text-[1.5rem] font-semibold text-[#D7D2DF] text-center">
        마지막 단계!{'\n'}이제 녹음하러 가볼까요?
      </p>
    </div>
  );
}
