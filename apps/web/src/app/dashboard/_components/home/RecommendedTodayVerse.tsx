"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { TodayVerse } from "../../page";
import { playSound } from "@/lib/sound";

const TRANSLATION_LABEL = "KRV - 개역한글";

interface Props {
  todayVerse: TodayVerse;
}

export default function RecommendedTodayVerse({ todayVerse }: Props) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openInfo = () => {
    playSound("/sounds/말씀 잠깐 보기 카드 공개_비공개.mp3");
    setIsClosing(false);
    setIsInfoOpen(true);
  };

  const closeInfo = () => {
    playSound("/sounds/원래 화면 다시 돌아갈때.mp3");
    setIsClosing(true);
    setTimeout(() => {
      setIsInfoOpen(false);
      setIsClosing(false);
    }, 200);
  };

  return (
    <>
      <h3
        className="
              relative z-10
              mb-[clamp(1rem,5vw,1.5rem)]
              text-dashboard-article-h3
            "
      >
        오늘의 말씀
      </h3>

      <div className="mb-[clamp(0.375rem,2vw,0.625rem)]">
        <p className="relative z-10 text-dashboard-article-p">
          {todayVerse?.fullText}
        </p>
      </div>

      <div className="relative z-10 w-full flex items-center justify-between gap-[clamp(0.5rem,2vw,0.75rem)]">
        <button
          type="button"
          onClick={openInfo}
          aria-label={`${TRANSLATION_LABEL} 번역본을 사용하는 이유 보기`}
          className="
            flex items-center gap-[clamp(0.25rem,1vw,0.375rem)]
            h-[clamp(1.75rem,7vw,2rem)]
            px-[clamp(0.625rem,3vw,0.75rem)]
            rounded-full
            bg-primary-100/25
            text-primary-400
            text-[clamp(0.6875rem,3vw,0.75rem)] font-medium
            whitespace-nowrap
          "
        >
          {TRANSLATION_LABEL}
          <Icon
            icon="ph:info-fill"
            className="text-[clamp(0.8125rem,3.5vw,0.9375rem)] shrink-0"
          />
        </button>

        <span className="text-dashboard-article-span whitespace-nowrap">
          {todayVerse?.reference}
        </span>
      </div>

      {isInfoOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#000000]/40"
            onClick={closeInfo}
            style={{ animation: isClosing ? "" : "fade-in 0.2s ease forwards" }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="krv-info-title"
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] rounded-t-[clamp(1rem,4vw,1.5rem)] px-[clamp(1.25rem,6vw,2rem)] pt-[clamp(1.25rem,5vw,1.75rem)] pb-[clamp(2.5rem,10vw,3.5rem)]"
            style={{
              animation: isClosing
                ? "slide-down 0.2s ease forwards"
                : "slide-up 0.3s ease forwards",
            }}
          >
            <button
              type="button"
              onClick={closeInfo}
              aria-label="닫기"
              className="absolute top-[clamp(0.75rem,3vw,1.25rem)] right-[clamp(1rem,4vw,1.5rem)] text-[#B0B0B0] text-[clamp(1.25rem,5vw,1.75rem)] leading-none"
            >
              <Icon icon="ph:x-bold" />
            </button>

            <h3
              id="krv-info-title"
              className="font-semibold text-[clamp(1rem,4.5vw,1.1875rem)] leading-[clamp(1.5rem,7vw,1.75rem)] text-[#1B1B1B] pb-[clamp(0.75rem,3vw,1rem)]"
            >
              왜 개역한글을 사용하나요?
            </h3>

            <p
              className="text-[#373737]"
              style={{
                fontWeight: 400,
                fontSize: "clamp(0.9375rem, 4vw, 1rem)",
                lineHeight: "1.6",
                letterSpacing: "-0.02em",
              }}
            >
              tolli는 성경 저작권을 존중합니다.
              <br />
              현재는 누구나 부담 없이 말씀을 암송할 수 있도록,
              <br />
              저작권이 자유로운 개역한글(KRV)을 사용하고 있습니다.
              <br />
              <br />
              정식 출시 이후에는 개역개정 등
              <br />
              다양한 성경 번역본을 지원할 예정입니다.
            </p>

            <hr className="border-[#e0e0e0] mt-[clamp(1rem,4vw,1.25rem)]" />

            <p
              className="text-[#8A8880]"
              style={{
                fontWeight: 500,
                fontSize: "clamp(0.75rem,3vw,0.8125rem)",
                lineHeight: "1.5rem",
                marginTop: "clamp(0.75rem, 3vw, 1rem)",
              }}
            >
              tolli는 특정 교단에 소속되지 않은, 누구나 함께 사용할 수 있는
              독립적인 성경 암송 서비스입니다.
            </p>
          </div>
        </>
      )}
    </>
  );
}
