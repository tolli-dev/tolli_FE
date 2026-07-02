'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Verse, StepMaskData } from '../types';
import MaskedVerse from './MaskedVerse';
import { playSound } from '@/lib/sound';

interface MultipleChoiceViewProps {
  step: 2 | 3 | 4 | 5;
  verse: Verse;
  stepMaskData: StepMaskData;
  verseId: string;
}

export default function MultipleChoiceView({
  step,
  verse,
  stepMaskData,
  verseId,
}: MultipleChoiceViewProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const currentMaskedWordIndex = stepMaskData.maskedIndices[answeredCount];

  const handleChoiceSelect = (choice: string) => {
    const correctText = verse.words.find((word) => word.index === currentMaskedWordIndex)?.text;
    const isCorrect = choice === correctText;

    if (isCorrect) {
      playSound('/sounds/정답.mp3');
      setWrongChoice(null);
      setAnswers((prev) => ({ ...prev, [currentMaskedWordIndex]: choice }));
    } else {
      playSound('/sounds/오답.mp3');
      setWrongChoice(choice);
      setTimeout(() => setWrongChoice(null), 500);
    }
  };

  const allAnswered = stepMaskData.maskedIndices.every((i) => answers[i]);

  const choices = useMemo(() => {
    const correctText = verse.words.find((w) => w.index === currentMaskedWordIndex)?.text ?? '';
    const pool = verse.words
      .filter((w) => w.index !== currentMaskedWordIndex && w.text !== correctText)
      .map((w) => w.text);
    const uniquePool = [...new Set(pool)];
    const shuffledPool = [...uniquePool].sort(() => Math.random() - 0.5);
    const distractors = shuffledPool.slice(0, 2);
    return [correctText, ...distractors].sort(() => Math.random() - 0.5);
  }, [answeredCount, verse]);

  useEffect(() => {
    if (!allAnswered) return;
    const timer = setTimeout(() => {
      if (step === 5) {
        router.push(`/study/${verseId}/recall-intro`);
      } else {
        router.push(`/study/${verseId}/${step + 1}`);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [allAnswered, router, verseId, step]);

  return (
    <section className="flex flex-col flex-1">
      <div className="flex flex-col mt-[clamp(5rem,20vh,10rem)] gap-[clamp(2rem,8vw,4.25rem)] px-[clamp(1.5rem,9vw,4.25rem)]">
        <p className="text-center text-[clamp(1rem,4.5vw,1.25rem)] font-medium leading-6 tracking-[0.03em] text-[#CCB5F0]">
          {verse.reference}
        </p>
        <MaskedVerse
          words={verse.words}
          maskedIndices={stepMaskData.maskedIndices.filter((i) => !answers[i])}
          answeredIndices={stepMaskData.maskedIndices.filter((i) => !!answers[i])}
        />
      </div>
      <div className="flex flex-col gap-4 px-11.25 h-50 mt-auto justify-end" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {!allAnswered &&
          choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoiceSelect(choice)}
              className={`py-3 rounded-[15px] bg-[#373737] text-[1.0625rem] text-[#CCB5F0] leading-5 tracking-[0.03em] ring-1 ring-inset ${wrongChoice === choice ? 'ring-[#FF0000]' : 'ring-transparent'}`}
            >
              {choice}
            </button>
          ))}
      </div>
    </section>
  );
}
