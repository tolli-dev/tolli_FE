"use client";

import { WordMeaningData } from "../types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { playSound } from "@/lib/sound";

interface Props {
  meanings: WordMeaningData[];
  tabbedWords: boolean[];
  watchMeaning: boolean[];
  setTabbedWords: Dispatch<SetStateAction<boolean[]>>;
  setWatchMeaning: Dispatch<SetStateAction<boolean[]>>;
}

export default function TabMaskedVerse({
  meanings,
  tabbedWords,
  watchMeaning,
  setTabbedWords,
  setWatchMeaning,
}: Props) {
  const [isOpen, setIsOpen] = useState<{
    meaning: WordMeaningData | null;
    condition: boolean;
    closing: boolean;
  }>({ meaning: null, condition: false, closing: false });

  useEffect(() => {
    meanings.forEach((word, index) => {
      if (!word.meaning) {
        if (!word.meaning) {
          setWatchMeaning((prev) => {
            const updatedMeaning = [...prev];
            updatedMeaning[index] = true;
            return updatedMeaning;
          });
        }
      }
    });
  }, [meanings]);

  const handleTabWords = (index: number) => {
    playSound("/sounds/보기 탭.mp3");
    setTabbedWords((prev) => {
      const updatedWords = [...prev];
      updatedWords[index] = true;
      return updatedWords;
    });
  };

  const handleWatchMeaning = (meaning: WordMeaningData, index: number) => {
    playSound("/sounds/말씀 잠깐 보기 카드 공개_비공개.mp3");
    setIsOpen({ meaning, condition: true, closing: false });
    setWatchMeaning((prev) => {
      const updatedMeaning = [...prev];
      updatedMeaning[index] = true;
      return updatedMeaning;
    });
  };

  const handleCloseMeaning = () => {
    playSound("/sounds/원래 화면 다시 돌아갈때.mp3");
    setIsOpen((prev) => ({ ...prev, closing: true }));
    setTimeout(() => {
      setIsOpen({ meaning: null, condition: false, closing: false });
    }, 200);
  };

  return (
    <div className="flex flex-wrap justify-center">
      {meanings.map((word, index) => {
        return (
          <span
            key={word.index}
            className="relative px-1 text-[clamp(1.5rem,6vw,2rem)] leading-[clamp(2.5rem,9vw,3.5rem)] select-none"
            style={{ color: "transparent" }}
            onClick={() => handleTabWords(index)}
          >
            {word.text}
            {!tabbedWords[index] && (
              <span
                className="absolute inset-x-0 rounded-[15px] overflow-hidden flex items-center justify-center"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "clamp(2rem,7vw,2.5rem)",
                  backgroundColor: "rgba(217,217,217,0.08)",
                  boxShadow:
                    "0 4px 4px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.2)",
                }}
              >
                <span
                  className="whitespace-nowrap text-[clamp(1.5rem,6vw,2rem)] leading-none"
                  style={{
                    color: "rgba(204,181,240,0.9)",
                    filter: "blur(6px)",
                    textShadow: "0 2px 8px rgba(204,181,240,0.4)",
                  }}
                >
                  {word.text}
                </span>
              </span>
            )}
            {tabbedWords[index] && (
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  color:
                    word.meaning && watchMeaning[index] ? "#CCB5F0" : "#D7D2DF",
                  textDecoration: word.meaning ? "underline" : "none",
                }}
                onClick={() => word.meaning && handleWatchMeaning(word, index)}
              >
                {word.text}
              </span>
            )}
          </span>
        );
      })}
      {isOpen.condition && isOpen.meaning && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleCloseMeaning} />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] rounded-t-[clamp(1rem,4vw,1.5rem)] px-[clamp(1.25rem,6vw,2rem)] pt-[clamp(1.25rem,5vw,1.75rem)] pb-[clamp(3rem,12vw,5rem)] min-h-[clamp(16rem,30vh,24rem)]"
            style={{ animation: isOpen.closing ? 'slide-down 0.2s ease forwards' : 'slide-up 0.3s ease forwards' }}
          >
            <button
              className="absolute top-[clamp(0.75rem,3vw,1.25rem)] right-[clamp(1rem,4vw,1.5rem)] text-[#B0B0B0] text-[clamp(1.25rem,5vw,1.75rem)] leading-none"
              onClick={handleCloseMeaning}
            >
              ×
            </button>
            <p
              style={{
                fontWeight: 400,
                fontSize: 'clamp(1rem, 4.5vw, 1.25rem)',
                lineHeight: '1.4',
                letterSpacing: '0.08em',
                color: '#373737',
                paddingBottom: 'clamp(0.75rem, 3vw, 1rem)',
              }}
            >
              {isOpen.meaning.text}
            </p>
            <hr className="border-[#e0e0e0]" />
            <p
              style={{
                fontWeight: 500,
                fontSize: 'clamp(0.875rem, 3.5vw, 0.9375rem)',
                lineHeight: '1.5rem',
                color: '#8A8880',
                paddingTop: 'clamp(0.75rem, 3vw, 1rem)',
              }}
            >
              {isOpen.meaning.meaning}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
