"use client";

import { useState } from "react";
import SwipeNav from "./_components/SwipeNav";
import DashboardHeader from "./_components/DashboardHeader";
import BeforeFinish from "./BeforeFinish";
import AfterFinish from "./AfterFinish";
import Bookmark from "./Bookmark";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDashboard } from "./_hooks/useDashboard";
import DashboardLayout from "./_components/DashboardLayout";

export type TodayVerse = {
  id: number;
  reference: string;
  fullText: string;
} | null;

export default function DashBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { state, onError } = useDashboard();
  const {
    nickname = "",
    todayVerse = null,
    done = false,
  } = state.status === "success" ? state.data : {};

  return (
    <DashboardLayout done={done}>
      <DashboardHeader nickname={nickname} done={done} />
      {state.status === "error" && (
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
            onClick={onError}
            className="w-full rounded-[1.25rem] bg-[#CCB5F0] py-[clamp(0.625rem,3.3vw,0.8125rem)] font-bold text-[clamp(1rem,4.6vw,1.125rem)] leading-[clamp(1.25rem,5.9vw,1.4375rem)] text-[#1B1B1B]"
          >
            다시 시도
          </button>
        </div>
      )}
      {state.status === "loading" && <LoadingSpinner />}
      {activeIndex === 0 &&
        state.status === "success" &&
        (done ? (
          <AfterFinish todayVerse={todayVerse} nickname={nickname} />
        ) : (
          <BeforeFinish nickname={nickname} />
        ))}
      {activeIndex === 1 && state.status === "success" && (
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
    </DashboardLayout>
  );
}
