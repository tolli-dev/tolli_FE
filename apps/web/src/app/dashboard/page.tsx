'use client';

import { useState } from 'react';

import SwipeNav from './_components/SwipeNav';
import DashboardHeader from './_components/DashboardHeader';
import BeforeFinish from './BeforeFinish';
import AfterFinish from './AfterFinish';
import Bookmark from './Bookmark';

const nickname = '몽디';

export default function DashBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <section
      className={`
        dashboard-layout
        flex flex-col w-full flex-1 min-h-0 justify-between items-center
        px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]
        ${done ? 'is-done' : ''}
      `}
    >
      <DashboardHeader nickname={nickname} done={done} />

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
