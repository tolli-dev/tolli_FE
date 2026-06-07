"use client";

import { useRouter } from "next/navigation";
import { dataConnect } from "@/lib/dataconnect";
import { deleteBookmark, addBookmark } from "@firebasegen/default-connector";
import { useState } from "react";
import { DataConnectError } from "firebase/data-connect";

interface Props {
  verse: {
    id: number;
    reference: string;
    fullText: string;
  };
  bookmarkedIds: Set<number>;
}

export default function IndividualStorage({ verse, bookmarkedIds }: Props) {
  const router = useRouter();
  const isBookmarked = bookmarkedIds.has(verse.id);
  const [bookmark, setBookmark] = useState(isBookmarked);

  const handleRetryStep = () => {
    router.push("/study/30/0");
  };

  const handleDeleteBookmark = async (verseId: number) => {
    await deleteBookmark(dataConnect, { verseId: verseId });
    setBookmark(false);
  };

  const handleAddBookmark = async (verseId: number) => {
    try {
      await addBookmark(dataConnect, { verseId: verseId });

      setBookmark(true);
    } catch (error) {
      if (error instanceof DataConnectError) {
        const message = error.message ?? "북마크 추가에 실패했습니다.";
        alert(message);
      } else {
        alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <article className="w-full shrink-0 flex flex-col border border-[#CCB5F0] bg-[#C8C8C8]/20 rounded-[clamp(1rem,4.5vw,1.25rem)] py-[clamp(1rem,4.5vw,1.375rem)] px-[clamp(1.125rem,5vw,1.5625rem)]">
      <span className="flex justify-end -mt-[6px] -mb-[6px]">
        {bookmark && (
          <button
            onClick={() => handleDeleteBookmark(verse.id)}
            title="즐겨찾기 삭제 버튼"
          >
            <svg
              className="w-[clamp(1.125rem,4.8vw,1.3125rem)] h-[clamp(1.125rem,4.8vw,1.3125rem)] text-[#CCB5F0] fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )}
        {!bookmark && (
          <button
            onClick={() => handleAddBookmark(verse.id)}
            title="즐겨찾기 등록 버튼"
          >
            <svg
              className="w-[clamp(1.125rem,4.8vw,1.3125rem)] h-[clamp(1.125rem,4.8vw,1.3125rem)] text-[#CCB5F0]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )}
      </span>
      <h3 className="font-semibold text-[clamp(0.875rem,4vw,1rem)] leading-[1.25] text-[#171717] mb-[clamp(0.5rem,2.5vw,0.6875rem)]">
        {verse.reference}
      </h3>
      <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535] mb-[clamp(0.5rem,3vw,0.75rem)] break-keep">
        {verse.fullText}
      </p>
      <div className="flex justify-end">
        <button
          onClick={handleRetryStep}
          className="
            w-fit rounded-full
            bg-[#6F6F6F] px-[clamp(0.875rem,4.5vw,1.1875rem)] py-[clamp(0.25rem,1.5vw,0.3125rem)]
            font-medium text-[clamp(0.6875rem,3vw,0.75rem)] leading-[1.4] tracking-[-2%] text-[#CCB5F0]"
        >
          다시 떠올리기
        </button>
      </div>
    </article>
  );
}
