import { Icon } from "@iconify/react";
import Image from "next/image";
import FullHappyTolli from "../../../public/images/onBoarding/fullHappyTolli.svg";
import NoiseOverlay from "./_components/NoiseOverlay";
import GrainBorder from "./_components/_GrainBorder";
import SwipeNav from "./_components/SwipeNav";

export default function AfterFinish() {
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
          src={FullHappyTolli}
          alt="full happy tolli"
          className="
            w-[clamp(12rem,55vw,18rem)]
            h-[clamp(12rem,55vw,18rem)]
          "
        />

        <article
          className="
            relative overflow-hidden w-full
            flex flex-col justify-center
            min-h-[clamp(8rem,38vw,11rem)]
            mb-[clamp(1rem,4vw,1.5rem)]
            px-[clamp(1.5rem,9vw,2.5rem)]
            py-[clamp(0.75rem,4vw,1.25rem)]
            rounded-[clamp(16px,5vw,22px)]
            bg-dashboard-article-bg/20
            shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_4px_4px_0_rgba(0,0,0,0.25)]
          "
        >
          <NoiseOverlay />
          <GrainBorder color="#CCB5F0" radius={18} strokeWidth={3} />

          <h3
            className="
              relative z-10
              mb-[clamp(1rem,5vw,1.5rem)]
              text-dashboard-article-h3
            "
          >
            오늘의 말씀
          </h3>

          <div className="mb-[clamp(0.375rem,2vw,0.625rem)]">
            <p className="relative z-10 text-dashboard-article-p">
              여호와는 나의 목자시니
            </p>
            <p className="relative z-10 text-dashboard-article-p">
              내가 부족함이 없으리로다
            </p>
          </div>

          <div className="relative z-10 w-full flex justify-end">
            <span className="text-dashboard-article-span">시편 23:1</span>
          </div>
        </article>

        <button
          className="
              w-full pointer-events-none
              h-[clamp(2.75rem,11vw,3.25rem)]
              text-dashboard-btn text-primary-75
              bg-dashboard-blocked-button
              rounded-[clamp(2.5rem,15vw,3.75rem)]
            "
        >
          오늘의 양식 완료
        </button>
      </main>

      <footer
        className="
                w-full flex justify-center items-center
                pt-[clamp(1rem,4vw,1.5rem)]
                pb-[max(env(safe-area-inset-bottom),0.5rem)]
              "
      >
        <SwipeNav />
      </footer>
    </>
  );
}
