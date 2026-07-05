"use client";

import { useEffect } from "react";
import Bookmark from "./bookmark/Bookmark";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDashboard } from "../_hooks/useDashboard";
import FetchError from "./FetchError";
import DashboardNav from "./DashboardNav";
import DashboardHome from "./home/DashboardHome";
import DashboardHeader from "./DashboardHeader";
import { useTab } from "../_hooks/useTab";
import { DashboardInitialData } from "../page";
import { fireAuth } from "@/firebase/fireAuth";
import { usePushToken } from "../_hooks/usePushToken";
import { useCheckAppVersion } from "../_hooks/useCheckAppVersion";
import UpdateRequiredModal from "./UpdateRequiredModal";

interface Props {
  initialData: DashboardInitialData;
  shouldRefreshSession: boolean;
}

export default function DashboardClient({
  initialData,
  shouldRefreshSession,
}: Props) {
  const needUpdate = useCheckAppVersion();
  const { activeIndex, onTabChange } = useTab();
  const { state, onError } = useDashboard(initialData ?? undefined);

  usePushToken(shouldRefreshSession);

  useEffect(() => {
    if (!shouldRefreshSession) return;
    fireAuth.currentUser?.getIdToken().then((idToken) => {
      fetch("/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }).catch(() => {});
    });
  }, [shouldRefreshSession]);

  const nickname =
    state.status === "success"
      ? state.data.nickname
      : (initialData?.nickname ?? "");
  const todayVerse =
    state.status === "success"
      ? state.data.todayVerse
      : (initialData?.todayVerse ?? null);
  const done =
    state.status === "success" ? state.data.done : (initialData?.done ?? false);

  return (
    <>
      {needUpdate && <UpdateRequiredModal />}
      <div className="relative w-full h-[clamp(1.125rem,5vw,1.5rem)] shrink-0 mb-[clamp(0.5rem,2vw,0.75rem)]">
        <DashboardHeader nickname={nickname} done={done} />
      </div>
      {state.status === "loading" && !initialData && <LoadingSpinner />}
      {state.status === "error" && <FetchError onError={onError} />}
      {(state.status === "success" || !!initialData) &&
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
    </>
  );
}
