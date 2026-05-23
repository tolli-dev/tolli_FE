import { Icon } from "@iconify/react";
import Image from "next/image";
import hungry_tolli from "../../../public/images/onBoarding/hungryTolli_1.svg";
import NoiseOverlay from "./_components/NoiseOverlay";
import Link from "next/link";
import GrainBorder from "./_components/_GrainBorder";
import LiquidGlassButton from "./_components/LiquidGlassButton";
import { NavBar } from "./_components/_NavBar";
import { useRouter } from "next/navigation";

export default function BeforeFinish() {
  const router = useRouter();

  const getTodayMission = () => {
    router.push("/study/30/0");
  };

  return (
    <>
      <header
        className="
          flex flex-row justify-end items-center w-full
          gap-[clamp(1.5rem,7vw,2.5rem)]
          mb-[clamp(0.5rem,2vw,0.75rem)]
        "
      >
        <Icon
          icon="tabler:archive-filled"
          className="w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
        />
        <Icon
          icon="iconamoon:profile-fill"
          className="w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
        />
      </header>

      <main className="flex flex-1 flex-col items-center w-full">
        <div className="flex flex-col w-full">
          <h1 className="text-dashboard-h1">몽디님,</h1>
          <h1 className="text-dashboard-h1">안녕하세요!</h1>
        </div>

        <Image
          src={hungry_tolli}
          alt="hungry tolli"
          className="
            w-[clamp(12rem,55vw,18rem)]
            h-[clamp(12rem,55vw,18rem)]
          "
        />

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

      <footer>
        <NavBar />
      </footer>
    </>
  );
}
