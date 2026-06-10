"use client";

import { useEffect } from "react";
import { Verse } from "../types";
import Link from "next/link";
import { useSoundEffect } from "@/app/hooks/useSoundEffect";
import posthog from "posthog-js";

export default function ReadVerse({
  verse,
  verseId,
}: {
  verse: Verse;
  verseId: string;
}) {
  const play = useSoundEffect("/sounds/처음 말씀 pop up 될때 소리.mp3");
  useEffect(() => {
    play();
    posthog.capture('study_started', { verse_id: verseId, reference: verse.reference });
  });

  return (
    <Link className="w-full h-dvh flex-1" href={`/study/${verseId}/1`}>
      <section className="flex flex-col flex-1">
        <div className="flex flex-col mt-[clamp(5rem,20vh,10rem)] justify-center gap-[clamp(2rem,8vw,4.25rem)] px-[clamp(1.5rem,9vw,4.25rem)]" style={{ animation: 'fade-in 0.3s ease forwards' }}>
          <p className="text-center text-[clamp(1rem,4.5vw,1.25rem)] font-medium leading-6 tracking-[0.03em] text-[#CCB5F0]">
            {verse.reference}
          </p>
          <div className="flex flex-wrap justify-center">
            {verse.words.map((value) => (
              <span
                key={value.index}
                className="px-1 text-[clamp(1.5rem,6vw,2rem)] text-[#D7D2DF] leading-[clamp(2.5rem,9vw,3.5rem)]"
              >
                {value.text}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Link>
  );
}
