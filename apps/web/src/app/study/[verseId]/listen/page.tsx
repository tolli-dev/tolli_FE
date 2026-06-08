"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import {
  getVerse,
  getTodayCompletionCount,
  getMyCompletions,
  createStudyCompletion,
} from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";
import Bookmark from "./_components/Bookmark";
import { QueryFetchPolicy } from "firebase/data-connect";

export default function ListenVerse() {
  const [played, setPlayed] = useState(false);
  const [home, setHome] = useState(false);
  const [bookmarkModal, setBookmarkModal] = useState(false);
  const [verseText, setVerseText] = useState("");
  const [reference, setReference] = useState("");
  const [todayCount, setTodayCount] = useState(0);
  const verseAudioRef = useState(() =>
    typeof Audio !== "undefined" ? new Audio() : null,
  )[0];
  const bgmAudioRef = useState(() =>
    typeof Audio !== "undefined" ? new Audio("/verse-audio/bgm.mp3") : null,
  )[0];
  const router = useRouter();
  const { verseId: verseIdParam } = useParams<{ verseId: string }>();
  const verseId = Number(verseIdParam);

  useEffect(() => {
    if (!verseId) return;
    getVerse(dataConnect, { id: verseId }).then((result) => {
      const verse = result.data.verse;
      if (!verse) return;
      setVerseText(verse.fullText);
      setReference(verse.reference);
    });
  }, [verseId]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    getTodayCompletionCount(dataConnect, { today: today.toISOString() }).then(
      (result) => {
        setTodayCount(result.data.studyCompletions.length);
      },
    );
  }, []);

  useEffect(() => {
    if (!bgmAudioRef) return;
    bgmAudioRef.loop = true;
    bgmAudioRef.volume = 0.7;

    // injectJavaScript는 네이티브 WebView 컨텍스트에서 실행되므로 autoplay 정책 우회됨
    (window as any).__startBGM = () => {
      bgmAudioRef.play().catch(() => {});
    };

    // 웹 브라우저 직접 접근 시 폴백
    bgmAudioRef.play().catch(() => {});

    return () => {
      bgmAudioRef.pause();
      verseAudioRef?.pause();
      delete (window as any).__startBGM;
    };
  }, []);

  const handleButton = () => {
    if (!verseAudioRef) return;

    if (played) {
      verseAudioRef.pause();
      setPlayed(false);
    } else {
      verseAudioRef.src = `/verse-audio/verses/${verseId}.mp3`;
      verseAudioRef.play();
      setPlayed(true);
      setHome(true);

      verseAudioRef.onended = () => {
        setPlayed(false);
      };
    }
  };

  const handleBookmarkModal = async () => {
    const { data } = await getMyCompletions(dataConnect, {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    });
    const isRetryMission = data.studyCompletions.some(
      (item) => item.verse.id === Number(verseId),
    );

    if (isRetryMission) {
      router.push("/study/completeRetry");
    } else {
      await createStudyCompletion(dataConnect, { verseId });
      setBookmarkModal(true);
    }
  };

  return (
    <section
      className="listenVerse-layout flex flex-col w-full h-full items-center overflow-hidden
      px-[clamp(1.5rem,10.8vw,2.625rem)]
      pt-[clamp(2.5rem,13.6vw,3.3125rem)]
      pb-[clamp(1.25rem,7.7vw,1.875rem)]"
    >
      <div className="flex flex-col items-center shrink-0 gap-[clamp(0.625rem,3.3vw,0.8125rem)] mb-[clamp(1.125rem,5.9vw,1.4375rem)]">
        <h2 className="text-center text-[#1B1B1B] font-bold text-[clamp(1.375rem,6.7vw,1.625rem)] leading-[clamp(1.75rem,8.7vw,2.125rem)]">
          오늘의 목소리를
          <br />
          들어보세요
        </h2>
        <div className="flex flex-row items-center justify-center gap-[clamp(0.25rem,1.75vw,0.4375rem)]">
          <Icon
            icon="fluent:people-20-filled"
            className="text-[#383838] text-[clamp(1rem,5.25vw,1.3125rem)]"
          />
          <h4 className="text-[#202020] font-medium text-[clamp(0.8125rem,4vw,1rem)] whitespace-nowrap">
            오늘 <span className="text-[#383838]">{todayCount}</span>명이 함께
            읽고 있어요
          </h4>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0 overflow-hidden w-full rounded-[clamp(2.5rem,12.8vw,3.125rem)] mb-[clamp(1.5rem,8vw,3.5rem)] z-10 bg-white/10 backdrop-blur-xs">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[clamp(2.5rem,12.8vw,3.125rem)]"
          style={{
            padding: "3px",
            background: "linear-gradient(to bottom left, #7A7A7A, #917DB0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
          }}
        />
        <div className="flex flex-col w-full h-full px-[clamp(2.5rem,14.9vw,3.625rem)] py-[clamp(1.5rem,8.5vw,2.0625rem)]">
          <div className="flex flex-1 min-h-0 items-center justify-center">
            <p className="text-[clamp(1.0625rem,5.1vw,1.25rem)] leading-[clamp(1.625rem,7.9vw,1.9375rem)] tracking-[-2%] text-[#1B1B1B] text-center break-keep">
              {verseText}
            </p>
          </div>
          <p className="shrink-0 text-[clamp(0.875rem,4.1vw,1rem)] leading-[clamp(1.125rem,5.1vw,1.25rem)] tracking-[3%] text-[#282828] text-center">
            {reference}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleButton}
        aria-label={played ? "일시정지" : "재생"}
        className="relative flex shrink-0 items-center justify-center rounded-full bg-[#CCB5F0]
        w-[clamp(3.5rem,16.9vw,4.125rem)] h-[clamp(3.5rem,16.9vw,4.125rem)]
        mb-[clamp(1rem,6vw,2.625rem)]"
      >
        {played ? (
          <div className="flex items-center gap-[clamp(0.25rem,1.5vw,0.375rem)]">
            <span className="w-[clamp(0.375rem,1.8vw,0.4375rem)] h-[clamp(1.375rem,6.9vw,1.6875rem)] rounded-[2px] bg-[#2E2E2E]" />
            <span className="w-[clamp(0.375rem,1.8vw,0.4375rem)] h-[clamp(1.375rem,6.9vw,1.6875rem)] rounded-[2px] bg-[#2E2E2E]" />
          </div>
        ) : (
          <div className="w-[clamp(1.125rem,5.6vw,1.375rem)] h-[clamp(1.375rem,6.9vw,1.6875rem)] translate-x-[2px] bg-[#2E2E2E] [clip-path:polygon(0%_0%,100%_50%,0%_100%)]" />
        )}
      </button>

      <button
        type="button"
        onClick={handleBookmarkModal}
        aria-label="홈으로 이동"
        className={`w-full shrink-0 bg-[#CCB5F0] flex items-center justify-center
          py-[clamp(0.625rem,3.3vw,0.8125rem)] rounded-[clamp(1rem,5vw,1.25rem)]
          text-[clamp(0.875rem,4vw,1rem)]
          ${home ? "" : "invisible pointer-events-none"}`}
      >
        홈으로
      </button>

      {bookmarkModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#000000]/60">
          <Bookmark verseId={verseId} />
        </div>
      )}
    </section>
  );
}
