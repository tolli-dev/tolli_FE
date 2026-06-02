"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import IndividualStorage from "./IndividualStorage";

interface CompletedVerse {
  id: string;
  completedAt: string;
  verse: {
    id: number;
    reference: string;
    fullText: string;
  };
}

interface Props {
  done: boolean;
  completedVerses: CompletedVerse[];
}

export default function StorageView({ done, completedVerses }: Props) {
  const router = useRouter();
  const [searchVerse, setSearchVerse] = useState("");

  const handleSearch = (value: string) => {
    setSearchVerse(value);
  };

  const filteredData = completedVerses.filter((item) => {
    return (
      item.verse.reference.includes(searchVerse) ||
      item.verse.fullText.includes(searchVerse)
    );
  });

  return (
    <section
      className={`
        dashboard-layout
        flex flex-col w-full flex-1 min-h-0 justify-between items-center
        px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]
        ${done ? "is-done" : ""}
      `}
    >
      <header className="flex flex-row items-center w-full gap-[clamp(1.5rem,7vw,2.5rem)] mb-[10px]">
        <div className="flex flex-row items-center">
          <Icon
            onClick={() => router.back()}
            icon="fluent:ios-arrow-24-filled"
            className="shrink-0 w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)] text-[#CCB5F0] cursor-pointer mr-auto"
          />
          <div className="relative flex-1 min-w-0">
            <Icon
              aria-hidden
              icon="tabler:search"
              className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#B2B2B2]"
            />
            <input
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
              aria-label="말씀 찾기"
              title="말씀 찾기"
              className="
                w-full h-[clamp(1.875rem,8vw,2.25rem)] rounded-full 
                border border-[#B2B2B2] bg-transparent 
                pl-[34px] pr-[14px] text-[clamp(0.75rem,3.5vw,0.875rem)] text-[#353535] 
                placeholder:text-[#B2B2B2] focus:outline-none focus:border-[#CCB5F0]"
            />
          </div>
        </div>
        <Icon
          icon="tabler:archive-filled"
          className="shrink-0 w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
        />
        <Icon
          icon="iconamoon:profile-fill"
          className="shrink-0 w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
        />
      </header>

      <div className="flex flex-col w-full shrink-0 mb-[clamp(0.625rem,3vw,0.9375rem)]">
        <h1 className="text-dashboard-h1">몽디의 보관함</h1>
        <h2 className="font-light text-[clamp(0.6875rem,3vw,0.75rem)] leading-[1.6] tracking-[-2%] text-[#353535]">
          지금까지 완료한 말씀들을 확인하고, 다시 복습할 수 있어요
        </h2>
      </div>

      {!searchVerse && completedVerses.length === 0 && (
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              아직 완료한 말씀 구절이 없어요
            </p>
          </div>
        </main>
      )}

      {!searchVerse && completedVerses.length !== 0 && (
        <main className="w-full flex-1 min-h-0 flex flex-col items-center">
          <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] overflow-auto bookmarks">
            {completedVerses.map((value) => (
              <IndividualStorage key={value.id} value={value} />
            ))}
          </div>
        </main>
      )}

      {searchVerse && filteredData.length === 0 && (
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              검색 결과를 찾을 수 없습니다
            </p>
          </div>
        </main>
      )}

      {searchVerse && filteredData.length !== 0 && (
        <main className="w-full flex-1 min-h-0 flex flex-col items-center">
          <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] overflow-auto bookmarks">
            {filteredData.map((value) => (
              <IndividualStorage key={value.id} value={value} />
            ))}
          </div>
        </main>
      )}
    </section>
  );
}
