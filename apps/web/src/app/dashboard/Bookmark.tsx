'use client';

import { useState, useEffect } from 'react';
import IndividualBookmark from './_components/IndividaulBookmark';
import { getMyBookmarks } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface BookMarks {
  verse: {
    id: number;
    reference: string;
    fullText: string;
  };
  createdAt: string;
}

export default function Bookmark({ nickname }: { nickname: string }) {
  const [bookmarks, setBookmarks] = useState<BookMarks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getMyBookmarks(dataConnect, {
        fetchPolicy: 'SERVER_ONLY',
      });
      setLoading(false);
      setBookmarks(data.bookmarks);
    } catch {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleError = () => {
    setError(false);
    setLoading(true);
    fetchData();
  };

  return (
    <div className="flex flex-1 flex-col items-center w-full min-h-0">
      <header className="flex flex-col w-full shrink-0 mb-[clamp(0.625rem,3vw,0.9375rem)]">
        <h1 className="text-dashboard-h1">{nickname}님의 즐겨찾기</h1>
        <h2 className="font-light text-[clamp(0.6875rem,3vw,0.75rem)] leading-[1.6] tracking-[-2%] text-[#353535]">
          톨리 무료 버전에서는
          <span className="font-medium">최대 10구절</span>
          까지 즐겨찾기 할 수 있어요
        </h2>
      </header>

      {error && !loading && (
        <div className="flex flex-col flex-1 items-center justify-center gap-[clamp(1rem,4.8vw,1.875rem)] w-full">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[clamp(0.9375rem,4.4vw,1.0625rem)] leading-[clamp(1.375rem,6.6vw,1.625rem)] text-[#494949]">
              데이터를 불러오지 못했어요
            </p>
            <p className="text-[clamp(0.9375rem,4.4vw,1.0625rem)] leading-[clamp(1.375rem,6.6vw,1.625rem)] text-[#494949]">
              잠시 후 다시 시도해주세요
            </p>
          </div>
          <button
            type="button"
            onClick={handleError}
            className="w-full rounded-[1.25rem] bg-[#CCB5F0] py-[clamp(0.625rem,3.3vw,0.8125rem)] font-bold text-[clamp(1rem,4.6vw,1.125rem)] leading-[clamp(1.25rem,5.9vw,1.4375rem)] text-[#1B1B1B]"
          >
            다시 시도
          </button>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {bookmarks.length === 0 && !error && !loading && (
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              아직 즐겨찾기한 말씀 구절이 없어요
            </p>
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              보관함에서 추가해주세요
            </p>
          </div>
        </main>
      )}

      {bookmarks.length !== 0 && !error && !loading && (
        <main className="w-full flex-1 min-h-0 flex flex-col items-center">
          <span className="w-full text-right font-semibold text-[clamp(0.75rem,3.5vw,0.875rem)] leading-[1.6] tracking-[-2%] text-[#686868] shrink-0 mb-0.75">
            {bookmarks.length}/10
          </span>
          <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] pb-[clamp(2.5rem,12vw,4.375rem)] overflow-auto bookmarks">
            {bookmarks.map((value) => (
              <IndividualBookmark key={value.verse.id} value={value} fetchData={fetchData} />
            ))}
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 w-full h-[clamp(12rem,40dvh,20.5625rem)]
            bg-linear-to-t from-[#CCB5F0] from-2% via-[#DFDFDF] via-30% to-transparent to-100%"
          />
        </main>
      )}
    </div>
  );
}
