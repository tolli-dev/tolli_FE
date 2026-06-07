"use client";

import { useState, useEffect } from "react";
import IndividualBookmark from "./_components/IndividaulBookmark";
import {
  getMyBookmarks,
  GetMyBookmarksData,
} from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";

interface BookMarks {
  verse: {
    id: number;
    reference: string;
    fullText: string;
  };
  createdAt: string;
}

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState<BookMarks[]>();

  useEffect(() => {
    const getBookmarks = async () => {
      const { data } = await getMyBookmarks(dataConnect, {
        fetchPolicy: "SERVER_ONLY",
      });
      setBookmarks(data.bookmarks);
    };
    getBookmarks();
  }, [bookmarks]);

  if (!bookmarks) return null;

  return (
    <div className="flex flex-1 flex-col items-center w-full min-h-0">
      <header className="flex flex-col w-full shrink-0 mb-[clamp(0.625rem,3vw,0.9375rem)]">
        <h1 className="text-dashboard-h1">몽디님의 즐겨찾기</h1>
        <h2 className="font-light text-[clamp(0.6875rem,3vw,0.75rem)] leading-[1.6] tracking-[-2%] text-[#353535]">
          톨리 무료 버전에서는
          <span className="font-medium">최대 10구절</span>
          까지 즐겨찾기 할 수 있어요
        </h2>
      </header>

      {bookmarks.length === 0 && (
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

      {bookmarks.length !== 0 && (
        <main className="w-full flex-1 min-h-0 flex flex-col items-center">
          <span className="w-full text-right font-semibold text-[clamp(0.75rem,3.5vw,0.875rem)] leading-[1.6] tracking-[-2%] text-[#686868] shrink-0 mb-[3px]">
            {bookmarks.length}/10
          </span>
          <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] pb-[clamp(2.5rem,12vw,4.375rem)] overflow-auto bookmarks">
            {bookmarks.map((value) => (
              <IndividualBookmark key={value.verse.id} value={value} />
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
