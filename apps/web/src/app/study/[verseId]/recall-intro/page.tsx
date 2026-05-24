'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function RecallIntroPage() {
  const router = useRouter();
  const { verseId } = useParams<{ verseId: string }>();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/study/${verseId}/6`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, verseId]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <p className="text-[1.5rem] font-semibold text-[#D7D2DF] text-center">
        이제 기억을 맞춰보겠습니다.
      </p>
    </div>
  );
}
