"use client";

import DashboardHeader from "./_components/DashboardHeader";
import Bookmark from "./_components/bookmark/Bookmark";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDashboard } from "./_hooks/useDashboard";
import DashboardLayout from "./_components/DashboardLayout";
import FetchError from "./_components/FetchError";
import DashboardNav from "./_components/DashboardNav";
import DashboardHome from "./_components/home/DashboardHome";
import { useTab } from "./_hooks/useTab";

export type TodayVerse = {
  id: number;
  reference: string;
  fullText: string;
} | null;

export default function DashBoard() {
  const { activeIndex, onTabChange } = useTab();
  const { state, onError } = useDashboard();
  const {
    nickname = "",
    todayVerse = null,
    done = false,
  } = state.status === "success" ? state.data : {};

  return (
    <DashboardLayout done={done}>
      <DashboardHeader nickname={nickname} done={done} />

      {state.status === "success" &&
        (activeIndex === 0 ? (
          <DashboardHome
            done={done}
            todayVerse={todayVerse}
            nickname={nickname}
          />
        ) : (
          <Bookmark nickname={nickname} />
        ))}

      <DashboardNav activeIndex={activeIndex} onTabChange={onTabChange} />
      {state.status === "error" && <FetchError onError={onError} />}
      {state.status === "loading" && <LoadingSpinner />}
    </DashboardLayout>
  );
}
