"use client";

import DiffHeader from "../header/DiffHeader";
import WritingContainer from "../center/WritingContainer";
import FinishInputButton from "../button/FinishInputButton";
import { useState } from "react";

const MOCK_DATA = {
  verse:
    "대저 하나님께로서 난 자마다 세상을 이기느니라 세상을 이긴 이김은 이것이니 우리의 믿음이니라",
  source: "민수기 6:24",
};

export default function WritingScreen({ onEnd }: { onEnd: () => void }) {
  const [correctAnswer, setCorrectAnswer] = useState({ verse: "", source: "" });

  const handleSubmitVerse = (value: string) => {
    if (correctAnswer.verse && correctAnswer.source) {
      onEnd();
      return;
    }
    // 정답 구절 받기
    setCorrectAnswer(MOCK_DATA);
  };

  return (
    <>
      <DiffHeader
        instruction1="말하기 어려운 상황이신가요?"
        instruction2="괜찮아요! 기억나는 만큼 입력해주세요"
      />
      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        <WritingContainer
          correctAnswer={correctAnswer}
          handleSubmitVerse={handleSubmitVerse}
        />
        <FinishInputButton
          type="submit"
          form={
            correctAnswer.verse && correctAnswer.source
              ? "complete-form"
              : "writing-form"
          }
          icon="lets-icons:check-fill"
          description="입력 완료"
        />
      </main>
    </>
  );
}
