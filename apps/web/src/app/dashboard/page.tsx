"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import SwipeNav from "./_components/SwipeNav";
import BeforeFinish from "./BeforeFinish";
import AfterFinish from "./AfterFinish";
import Bookmark from "./Bookmark";

export default function DashBoard() {
  const [done, setDone] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className={`
        dashboard-layout
        flex flex-col w-full flex-1 min-h-0 justify-between items-center
        px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]
        ${done ? "is-done" : ""}
      `}
    >
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

      {activeIndex === 0 && (done ? <AfterFinish /> : <BeforeFinish />)}
      {activeIndex === 1 && <Bookmark />}

      <footer
        className="
                w-full flex justify-center items-center
                pt-[clamp(1rem,4vw,1.5rem)]
                pb-[max(env(safe-area-inset-bottom),0.5rem)]
              "
      >
        <SwipeNav activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </footer>
    </section>
  );
}
