'use client';

import { useState, useEffect } from 'react';
import { getMe, getMyCurrentVerse } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from '@/firebase/fireAuth';
import SwipeNav from './_components/SwipeNav';
import DashboardHeader from './_components/DashboardHeader';
import BeforeFinish from './BeforeFinish';
import AfterFinish from './AfterFinish';
import Bookmark from './Bookmark';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type TodayVerse = { id: number; reference: string; fullText: string } | null;

export default function DashBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nickname, setNickname] = useState('');
  const [done, setDone] = useState(false);
  const [todayVerse, setTodayVerse] = useState<TodayVerse>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      Promise.all([
        getMe(dataConnect),
        getMyCurrentVerse(dataConnect, { today: today.toISOString() }),
      ]).then(([meResult, verseResult]) => {
        setNickname(meResult.data.user?.nickname ?? '');
        const verse = verseResult.data.todayCompletion[0]?.verse ?? null;
        setTodayVerse(verse);
        setDone(verse !== null);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

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

      {loading && <LoadingSpinner />}
      {activeIndex === 0 && !loading &&
        (done ? <AfterFinish todayVerse={todayVerse} nickname={nickname} /> : <BeforeFinish nickname={nickname} />)}
      {activeIndex === 1 && <Bookmark />}

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
    </section>
  );
}
