'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Verse, StepMaskData } from './types';
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
      router.push(`/study/${verseId}/${step + 1}`);
    }
  }, [allAnswered, router, verseId, step]);

  return (
    <section className="flex flex-col flex-1 px-4 py-6 gap-6">
      <p className="text-center text-sm text-surface-300">{verse.reference}</p>

      <MaskedVerse
        words={verse.words}
        maskedIndices={stepMaskData.maskedIndices.filter((i) => !answers[i])}
        activeIndex={currentMaskedWordIndex}
      />

      <div className="flex flex-col gap-2">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleChoiceSelect(choice)}
            className="w-full py-3 rounded-xl bg-surface-500 text-primary-75"
          >
            {choice}
          </button>
        ))}
      </div>
    </section>
  );
}
