"use client";

import { useRouter } from "next/navigation";
import { dataConnect } from "@/lib/dataconnect";
import posthog from "posthog-js";
import { deleteBookmark, addBookmark } from "@firebasegen/default-connector";
import { useState } from "react";
import { DataConnectError } from "firebase/data-connect";
import { playSound } from "@/lib/sound";

interface Props {
  verse: {
    id: number;
    reference: string;
    fullText: string;
  };
  bookmarkedIds: Set<number>;
}

function extractErrorMessage(error: DataConnectError): string {
  const fallback = "북마크 추가에 실패했습니다.";
  let list: { message?: string }[] | undefined;

  const response = (error as { response?: { errors?: { message?: string }[] } })
    .response;
  if (Array.isArray(response?.errors)) {
    list = response.errors;
  } else {
    try {
      const parsed = JSON.parse(error.message);
      if (Array.isArray(parsed)) list = parsed;
    } catch {}
  }

  const raw =
    list?.find((e) => e?.message && e.message !== "(aborted)")?.message ??
    error.message ??
    fallback;

  return raw.replace(/\s*\(aborted\)\s*$/i, "").trim() || fallback;
}

export default function IndividualStorage({ verse, bookmarkedIds }: Props) {
  const router = useRouter();
  const isBookmarked = bookmarkedIds.has(verse.id);
  const [bookmark, setBookmark] = useState(isBookmarked);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRetryStep = () => {
    posthog.capture("recall_clicked", { verse_id: verse.id });
    sessionStorage.setItem("studyFrom", "recall");
    router.push(`/study/${verse.id}/1`);
  };

  const handleDeleteBookmark = async (verseId: number) => {
    setBookmark(false);
    try {
      await deleteBookmark(dataConnect, { verseId: verseId });
    } catch {
      setBookmark(true);
    }
  };

  const handleAddBookmark = async (verseId: number) => {
    setBookmark(true);
    playSound("/sounds/어디론가 추가되었을때.mp3");
    try {
      await addBookmark(dataConnect, { verseId: verseId });
    } catch (error) {
      setBookmark(false);
      if (error instanceof DataConnectError) {
        setErrorMessage(extractErrorMessage(error));
      } else {
        setErrorMessage("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
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

      {errorMessage && (
        <div
          onClick={() => setErrorMessage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/60 px-[clamp(0.875rem,5vw,1.25rem)]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-90 rounded-[clamp(1rem,6vw,1.5rem)] bg-linear-to-br from-white/30 via-white/15 to-white/20 p-px"
          >
            <div className="flex flex-col items-center justify-center w-full py-[clamp(1rem,6vw,1.5rem)] px-[clamp(1rem,6vw,1.5rem)] bg-bg rounded-[clamp(1rem,6vw,1.5rem)]">
              <p className="text-center font-semibold text-[clamp(1rem,4.75vw,1.1875rem)] leading-[clamp(1.5rem,7.75vw,1.9375rem)] text-[#CCB5F0] mb-[clamp(0.75rem,4.5vw,1.125rem)] break-keep">
                {errorMessage}
              </p>
              <div className="flex flex-col w-full gap-[clamp(0.375rem,2vw,0.5rem)]">
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="w-full rounded-[clamp(0.875rem,5vw,1.25rem)] py-[clamp(0.5rem,3vw,0.75rem)] font-semibold text-bg bg-[#CCB5F0] text-[clamp(0.8125rem,3.75vw,0.9375rem)] leading-[clamp(1.25rem,6.25vw,1.5625rem)]"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
