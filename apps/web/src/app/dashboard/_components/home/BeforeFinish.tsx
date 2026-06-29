"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Nickname from "./Nickname";
import Illustration from "./Illustration";
import Card from "./Card";

const src = "/images/onBoarding/hungryTolli_1.webp";

export default function BeforeFinish({ nickname }: { nickname: string }) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const getTodayMission = () => {
    setNavigating(true);
    router.push("/study/loading");
  };

  return (
    <main className="flex flex-1 flex-col items-center w-full">
      <Nickname nickname={nickname} />
      <Illustration src={src} />

      <Card className="items-center">
        <p className="relative z-10 text-dashboard-article-p">
          오늘의 양식이 기다려요
        </p>
        <p className="relative z-10 text-dashboard-article-p">
          말씀으로 하루를 시작해요!
        </p>
      </Card>

      <button
        className="
        w-full
        h-[clamp(2.75rem,11vw,3.25rem)]
        text-dashboard-btn text-primary-75
              bg-surface-500
              rounded-[clamp(2.5rem,15vw,3.75rem)]
              "
        onClick={getTodayMission}
      >
        오늘의 양식 받기
      </button>
      {navigating && <LoadingSpinner />}
    </main>
  );
}
