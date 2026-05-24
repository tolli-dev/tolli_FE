'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Verse, StepMaskData } from '../types';
import MaskedVerse from './MaskedVerse';

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
  const [started, setStarted] = useState(step !== 2);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const answeredCount = Object.keys(answers).length;
  const currentMaskedWordIndex = stepMaskData.maskedIndices[answeredCount];

  const handleChoiceSelect = (choice: string) => {
    const correctText = verse.words.find((word) => word.index === currentMaskedWordIndex)?.text;
    const isCorrect = choice === correctText;

    if (isCorrect) {
      setAnswers((prev) => ({ ...prev, [currentMaskedWordIndex]: choice }));
    }
  };

  const allAnswered = stepMaskData.maskedIndices.every((i) => answers[i]);

  const choices = stepMaskData.choices[currentMaskedWordIndex] ?? [];

  useEffect(() => {
    if (allAnswered) {
      if (step === 5) {
        router.push(`/study/${verseId}/recall-intro`);
      } else {
        router.push(`/study/${verseId}/${step + 1}`);
      }
    }
  }, [allAnswered, router, verseId, step]);

  return (
    <section className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 justify-center gap-17 px-17">
        <p className="text-center text-[1rem] font-medium leading-5 tracking-[0.03em] text-[#CCB5F0]">
          {verse.reference}
        </p>
        {!started ? (
          <MaskedVerse words={verse.words} />
        ) : (
          <MaskedVerse
            words={verse.words}
            maskedIndices={stepMaskData.maskedIndices.filter((i) => !answers[i])}
            answeredIndices={stepMaskData.maskedIndices.filter((i) => !!answers[i])}
          />
        )}
      </div>
      <div className="flex flex-col gap-4 px-11.25 min-h-50 justify-end">
        {!started ? (
          <button
            onClick={() => setStarted(true)}
            className="mt-auto py-1.75 mx-auto w-32 rounded-[20px] border border-[#CCB5F0] text-[1rem] text-[#FFFFFF] font-bold tracking-[0.03em]"
            style={{ marginTop: 0, marginBottom: 'auto' }}
          >
            시작하기
          </button>
        ) : (
          choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoiceSelect(choice)}
              className="py-3 rounded-[15px] bg-[#373737] text-[1.0625rem] text-[#CCB5F0] leading-5 tracking-[0.03em]"
            >
              {choice}
            </button>
          ))
        )}
      </div>
    </section>
  );
}
