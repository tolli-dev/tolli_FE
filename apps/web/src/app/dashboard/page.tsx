"use client";

import { useState, useEffect } from "react";
import { getMe, getMyCurrentVerse } from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/firebase/fireAuth";
import SwipeNav from "./_components/SwipeNav";
import DashboardHeader from "./_components/DashboardHeader";
import BeforeFinish from "./BeforeFinish";
import AfterFinish from "./AfterFinish";
import Bookmark from "./Bookmark";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type TodayVerse = { id: number; reference: string; fullText: string } | null;

export default function DashBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nickname, setNickname] = useState("");
  const [done, setDone] = useState(false);
  const [todayVerse, setTodayVerse] = useState<TodayVerse>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Promise.all([
      getMe(dataConnect, {
        fetchPolicy: "SERVER_ONLY",
      }),
      getMyCurrentVerse(
        dataConnect,
        { today: today.toISOString() },
        { fetchPolicy: "SERVER_ONLY" },
      ),
    ])
      .then(([meResult, verseResult]) => {
        setNickname(meResult.data.user?.nickname ?? "");
        const verse = verseResult.data.todayCompletion[0]?.verse ?? null;
        setTodayVerse(verse);
        setDone(verse !== null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      if (!user) return;
      fetchData();
    });
    return () => unsubscribe();
  }, []);

  const handleError = () => {
    setError(false);
    setLoading(true);
    fetchData();
  };

  return (
    <section
      className={`
        dashboard-layout
        flex flex-col w-full flex-1 min-h-0 justify-between items-center
        px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]
        ${done ? "is-done" : ""}
      `}
    >
      <DashboardHeader nickname={nickname} done={done} />
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
      {activeIndex === 0 &&
        !loading &&
        !error &&
        (done ? (
          <AfterFinish todayVerse={todayVerse} nickname={nickname} />
        ) : (
          <BeforeFinish nickname={nickname} />
        ))}
      {activeIndex === 1 && !loading && !error && (
        <Bookmark nickname={nickname} />
      )}

      <footer
        className="
          fixed bottom-0 left-0 right-0
          flex justify-center items-center
          pb-[max(calc(env(safe-area-inset-bottom)+1rem),1rem)]
          pt-4
        "
      >
        <SwipeNav activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </footer>
    </section>
  );
}
