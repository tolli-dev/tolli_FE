"use client";

import { useState } from "react";

type Props = {
  correctAnswer: { verse: string; source: string };
  handleSubmitVerse: (text: string) => void;
};

const MAX_LENGTH = 100;

export default function WritingContainer({
  correctAnswer,
  handleSubmitVerse,
}: Props) {
  const [verse, setVerse] = useState("");

  const handleWritingVerse = (value: string) => {
    if (value.length <= MAX_LENGTH) setVerse(value);
  };

  return (
    <>
      <form
        id={
          correctAnswer.verse && correctAnswer.source
            ? "complete-form"
            : "writing-form"
        }
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitVerse(verse.trim());
        }}
        className="
        flex flex-col h-full w-full items-center rounded-[3.125rem]
        bg-linear-to-tr from-[#917DB0] to-[#7A7A7A] p-0.5 w-full
      "
      >
        {!correctAnswer.verse && !correctAnswer.source && (
          <>
            <div className="flex flex-1 flex-col w-full items-center rounded-[3.125rem] bg-bg p-4 px-[clamp(1.5rem,11vw,2.6875rem)] pt-[clamp(1.75rem,10vw,2.5rem)] pb-[clamp(1.25rem,7.5vw,1.875rem)]">
              <label htmlFor="verse" className="sr-only">
                말씀 입력
              </label>
              <textarea
                id="verse"
                name="verse"
                value={verse}
                onChange={(e) => handleWritingVerse(e.target.value)}
                className="w-full flex-1 font-regular tracking-[-0.02em] text-[#F1F1F1] text-[clamp(1rem,5vw,1.25rem)] leading-[clamp(1.5rem,8vw,1.9375rem)]"
              />
              <div
                className="
                  flex justify-end w-full text-left font-medium tracking-[0.03em] text-[#F1F1F1]
                  text-[clamp(0.75rem,3.5vw,0.875rem)] leading-[clamp(1rem,5vw,1.25rem)]
                "
              >
                {verse.length}/{MAX_LENGTH}
              </div>
            </div>
          </>
        )}

        {correctAnswer.source && correctAnswer.verse && (
          <>
            <div className="flex flex-1 flex-col w-full items-center rounded-[3.125rem] bg-bg p-4 px-[clamp(1.5rem,11vw,2.6875rem)] pt-[clamp(2.5rem,14vw,3.5rem)] pb-[clamp(1.25rem,7.5vw,1.875rem)]">
              <p className="w-full whitespace-pre-wrap font-regular tracking-[-0.02em] text-[#CCB5F0] text-[clamp(1rem,5vw,1.25rem)] leading-[clamp(1.5rem,8vw,1.9375rem)] mb-3.75">
                {correctAnswer.verse}
              </p>
              <p className="w-full font-medium tracking-[0.03em] text-[#CCB5F0] text-[clamp(0.75rem,3.5vw,0.875rem)] leading-[clamp(1rem,5vw,1.25rem)]">
                {correctAnswer.source}
              </p>
              <div
                className="
                mt-auto flex justify-end w-full text-left font-medium tracking-[0.03em] text-[#F1F1F1]
                text-[clamp(0.75rem,3.5vw,0.875rem)] leading-[clamp(1rem,5vw,1.25rem)]
              "
              >
                {correctAnswer.verse.length}/{MAX_LENGTH}
              </div>
            </div>
          </>
        )}
      </form>
    </>
  );
}
