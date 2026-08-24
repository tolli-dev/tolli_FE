import { TodayVerse } from "../../page";
import Nickname from "./Nickname";
import Illustration from "./Illustration";
import Card from "./Card";

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

      <Card className="px-[clamp(1.5rem,9vw,2.5rem)] py-[clamp(0.75rem,4vw,1.25rem)]">
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
          <p className="relative z-10 text-dashboard-article-p">{todayVerse?.fullText}</p>
        </div>

        <div className="relative z-10 w-full flex items-center justify-end">
          <span className="text-dashboard-article-span whitespace-nowrap">
            {todayVerse?.reference}
          </span>
        </div>
      </Card>

      <button
        className="
            w-full pointer-events-none
            font-semibold tracking-[-2%]
            text-[clamp(0.875rem,4.1vw,1rem)]
            leading-[clamp(1.75rem,8.2vw,2rem)]
            h-[clamp(2.75rem,11vw,3.25rem)]
          text-[#D5CAE6] bg-[#4E4E4E]
            rounded-[clamp(2.5rem,15vw,3.75rem)]"
      >
        오늘의 양식 완료
      </button>
    </main>
  );
}
