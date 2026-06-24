"use client";

import { useState } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import BeforeFinish from "./BeforeFinish";
import AfterFinish from "./AfterFinish";
import Bookmark from "./Bookmark";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDashboard } from "./_hooks/useDashboard";
import DashboardLayout from "./_components/DashboardLayout";
import DashboardError from "./_components/DashboardError";
import DashboardNav from "./_components/DashboardNav";

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

      <DashboardNav activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      {state.status === "error" && <DashboardError onError={onError} />}
      {state.status === "loading" && <LoadingSpinner />}
    </DashboardLayout>
  );
}
