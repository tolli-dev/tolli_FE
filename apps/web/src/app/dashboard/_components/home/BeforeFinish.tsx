"use client";

import { useState } from "react";
import NoiseOverlay from "../NoiseOverlay";
import GrainBorder from "../_GrainBorder";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Nickname from "./Nickname";
import Illustration from "./Illustration";

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
      {navigating && <LoadingSpinner />}
      <Nickname nickname={nickname} />
      <Illustration src={src} />

      <article
        className="
            relative overflow-hidden w-full
            flex flex-col items-center justify-center
            min-h-[clamp(8rem,38vw,11rem)]
            mb-[clamp(1rem,4vw,1.5rem)]
            rounded-[clamp(16px,5vw,22px)]
            bg-dashboard-article-bg/20
            shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_4px_4px_0_rgba(0,0,0,0.25)]
          "
      >
        <NoiseOverlay />
        <GrainBorder color="#CCB5F0" radius={18} strokeWidth={3} />
        <p className="relative z-10 text-dashboard-article-p">
          오늘의 양식이 기다려요
        </p>
        <p className="relative z-10 text-dashboard-article-p">
          말씀으로 하루를 시작해요!
        </p>
      </article>

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
    </main>
  );
}
