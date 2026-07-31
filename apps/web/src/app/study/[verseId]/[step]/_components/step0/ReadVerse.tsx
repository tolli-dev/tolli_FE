"use client";

import { useEffect } from "react";
import { Verse } from "../types";
import Link from "next/link";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import posthog from "posthog-js";
import { EXPERIMENT_KEY, VARIANT_SKIP_STEP1 } from "@/lib/experiment";

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
    posthog.capture('study_started', {
      verse_id: verseId,
      reference: verse.reference,
      // step0을 보는 건 실험군(B)뿐이다. 대조군은 step1에서 시작한다.
      experiment: EXPERIMENT_KEY,
      variant: VARIANT_SKIP_STEP1,
      entry_step: 0,
    });
    // play/verseId/reference는 매 렌더 동일하므로 마운트 시 1회만 실행한다.
    // 의존성 배열이 없으면 리렌더마다 study_started가 중복 발생한다.
  }, [play, verseId, verse.reference]);

  return (
    // 실험군은 step1(단어 뜻 탭)을 건너뛰고 바로 빈칸 연습으로 넘어간다.
    <Link className="w-full h-dvh flex-1" href={`/study/${verseId}/step2-intro`}>
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
