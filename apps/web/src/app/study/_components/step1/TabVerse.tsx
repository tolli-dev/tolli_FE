"use client";

import { Verse, WordMeaningData } from "../types";
import { useState } from "react";
import Link from "next/link";
import TabMaskedVerse from "./TabMaskedVerse";
import { playSound } from "@/lib/sound";

export default function TabVerse({
  verse,
  meanings,
  verseId,
}: {
  verse: Verse;
  meanings: WordMeaningData[];
  verseId: string;
}) {
  const [tabbedWords, setTabbedWords] = useState<boolean[]>(
    Array(meanings.length).fill(false),
  );
  const [watchMeaning, setWatchMeaning] = useState<boolean[]>(
    Array(meanings.length).fill(false),
  );

  const checkAllWordsAreTabbed = tabbedWords.every((value) => value);
  const checkAllWordsAreRead = watchMeaning.every((value) => value);

  return (
    <section className="flex flex-col flex-1">
      <div className="flex flex-col mt-[clamp(5rem,20vh,10rem)] justify-center gap-[clamp(2rem,8vw,4.25rem)] px-[clamp(1.5rem,9vw,4.25rem)]">
        <p className="text-center text-[clamp(1rem,4.5vw,1.25rem)] font-medium leading-6 tracking-[0.03em] text-[#CCB5F0]">
          {verse.reference}
        </p>
        <TabMaskedVerse
          meanings={meanings}
          tabbedWords={tabbedWords}
          watchMeaning={watchMeaning}
          setTabbedWords={setTabbedWords}
          setWatchMeaning={setWatchMeaning}
        />

        <>
          {!checkAllWordsAreTabbed && (
            <p className="text-center mt-[clamp(1rem,4vw,1.25rem)] font-light text-[clamp(0.8rem,3.5vw,0.875rem)] leading-5 tracking-[0.03em] text-[#CCB5F0]">
              블록을 탭해서 말씀을 꺼내보세요.
            </p>
          )}
          {checkAllWordsAreTabbed && !checkAllWordsAreRead && (
            <p className="text-center mt-[clamp(1rem,4vw,1.25rem)] font-light text-[clamp(0.8rem,3.5vw,0.875rem)] leading-5 tracking-[0.03em] text-[#CCB5F0]">
              밑줄친 단어를 눌러보세요.
            </p>
          )}
        </>

        {checkAllWordsAreTabbed && checkAllWordsAreRead && (
          <Link href={`/study/${verseId}/2`} className="mt-auto mx-auto">
            <button
              onClick={() => playSound("/sounds/다음탭 이동.mp3")}
              className="mt-auto py-1.75 mx-auto w-32 rounded-[20px] border border-[#CCB5F0] text-[1rem] text-[#FFFFFF] font-bold tracking-[0.03em]"
              style={{ marginTop: 0, marginBottom: "auto" }}
            >
              다음으로
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}
