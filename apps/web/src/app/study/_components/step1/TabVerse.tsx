"use client";

import { Verse } from "../types";
import { useState } from "react";
import Link from "next/link";
import TabMaskedVerse from "./TabMaskedVerse";

export default function TabVerse({
  verse,
  verseId,
}: {
  verse: Verse;
  verseId: string;
}) {
  const [tabbedWords, setTabbedWords] = useState(
    Array(verse.words.length).fill(false),
  );

  const checkAllWordsAreTabbed = tabbedWords.every((value) => value);

  return (
    <section className="flex flex-col flex-1">
      <div className="flex flex-col mt-[clamp(5rem,20vh,10rem)] justify-center gap-[clamp(2rem,8vw,4.25rem)] px-[clamp(1.5rem,9vw,4.25rem)]">
        <p className="text-center text-[clamp(1rem,4.5vw,1.25rem)] font-medium leading-6 tracking-[0.03em] text-[#CCB5F0]">
          {verse.reference}
        </p>
        <TabMaskedVerse
          words={verse.words}
          tabbedWords={tabbedWords}
          setTabbedWords={setTabbedWords}
        />
        <p className="text-center mt-[clamp(1rem,4vw,1.25rem)] font-light text-[clamp(0.8rem,3.5vw,0.875rem)] leading-5 tracking-[0.03em] text-[#CCB5F0]">
          블록을 탭해서 말씀을 꺼내보세요.
        </p>
        {checkAllWordsAreTabbed && (
          <Link href={`/study/${verseId}/2`} className="mt-auto mx-auto">
            <button
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
