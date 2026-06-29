import { TodayVerse } from "../../page";
import AfterFinish from "./AfterFinish";
import BeforeFinish from "./BeforeFinish";

interface Props {
  done: boolean;
  todayVerse: TodayVerse;
  nickname: string;
}

export default function DashboardHome({ done, todayVerse, nickname }: Props) {
  return done ? (
    <AfterFinish todayVerse={todayVerse} nickname={nickname} />
  ) : (
    <BeforeFinish nickname={nickname} />
  );
}
