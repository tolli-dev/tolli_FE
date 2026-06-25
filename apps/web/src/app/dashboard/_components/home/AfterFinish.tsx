import NoiseOverlay from "../NoiseOverlay";
import GrainBorder from "../_GrainBorder";
import { TodayVerse } from "../../page";
import Nickname from "./Nickname";
import Illustration from "./Illustration";

const src = "/images/onBoarding/fullHappyTolli.webp";

export default function AfterFinish({
  todayVerse,
  nickname,
}: {
  todayVerse: TodayVerse;
  nickname: string;
}) {
  return (
    <main className="flex flex-1 flex-col items-center w-full">
      <Nickname nickname={nickname} />
      <Illustration src={src} />

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
            {todayVerse?.fullText}
          </p>
        </div>

        <div className="relative z-10 w-full flex justify-end">
          <span className="text-dashboard-article-span">
            {todayVerse?.reference}
          </span>
        </div>
      </article>

      <button
        className="
            w-full pointer-events-none
            font-semibold tracking-[-2%]
            text-[clamp(0.875rem,4.1vw,1rem)]
            leading-[clamp(1.75rem,8.2vw,2rem)]
            h-[clamp(2.75rem,11vw,3.25rem)]
          text-[#1E1E1E] bg-[#CCB5F0]
            rounded-[clamp(2.5rem,15vw,3.75rem)]"
      >
        오늘의 양식 완료
      </button>
    </main>
  );
}
