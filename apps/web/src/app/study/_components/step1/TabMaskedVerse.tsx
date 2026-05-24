import { Word, WordMeaningData } from "../types";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  meanings: WordMeaningData[];
  tabbedWords: boolean[];
  setTabbedWords: Dispatch<SetStateAction<boolean[]>>;
}

export default function TabMaskedVerse({
  meanings,
  tabbedWords,
  setTabbedWords,
}: Props) {
  /*
  const indexToMeaning = new Map<number, WordMeaningData>();

  meaning?.forEach((wordMeaning) => {
    wordMeaning.meaningIndices.forEach((index) =>
      indexToMeaning.set(index, wordMeaning),
    );
  });
  */

  const handleTabWords = (index: number) => {
    setTabbedWords((prev) => {
      const updatedWords = [...prev];
      updatedWords[index] = true;
      return updatedWords;
    });
  };

  return (
    <div className="flex flex-wrap justify-center">
      {meanings.map((word, index) => {
        // const wordMeaning = indexToMeaning.get(word.index);

        if (!tabbedWords[index] || tabbedWords[index]) {
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
                  key={word.index}
                  className="absolute inset-0 flex items-center justify-center text-[#D7D2DF]"
                  style={{
                    textDecoration: word.meaning ? "underline" : "none",
                  }}
                >
                  {word.text}
                </span>
              )}
            </span>
          );
        }
      })}
    </div>
  );
}
