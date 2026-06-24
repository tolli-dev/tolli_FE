import { Dispatch, SetStateAction } from "react";
import SwipeNav from "./SwipeNav";

interface Props {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}

export default function DashboardNav({ activeIndex, setActiveIndex }: Props) {
  return (
    <footer
      className="
              fixed bottom-0 left-0 right-0
              flex justify-center items-center
              pb-[max(calc(env(safe-area-inset-bottom)+1rem),1rem)]
              pt-4
            "
    >
      <SwipeNav activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </footer>
  );
}
