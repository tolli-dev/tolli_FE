import { TodayVerse } from "../../page";

interface Props {
  todayVerse: TodayVerse;
}

export default function RecommendedTodayVerse({ todayVerse }: Props) {
  return (
    <>
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
    </>
  );
}
