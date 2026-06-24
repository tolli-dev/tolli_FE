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
import DashboardError from "./_components/DashboardError";

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
      {state.status === "error" && <DashboardError onError={onError} />}
      {state.status === "loading" && <LoadingSpinner />}
    </DashboardLayout>
  );
}
