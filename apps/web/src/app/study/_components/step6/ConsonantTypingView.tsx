'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Verse } from '../types';
import HangulKeyboard from './HangulKeyboard';
import { toChosung, isVowel, isHangulChar, combineHangul, decomposeHangul } from './hangul';

interface ConsonantTypingViewProps {
  verse: Verse;
  verseId: string;
}

// "요한일서 5:4" → { bookName: "요한일서", chapterVerse: "5:4" }
function parseReference(reference: string): { bookName: string; chapterVerse: string } {
  const spaceIdx = reference.lastIndexOf(' ');
  if (spaceIdx < 0) return { bookName: reference, chapterVerse: '' };
  return {
    bookName: reference.slice(0, spaceIdx),
    chapterVerse: reference.slice(spaceIdx + 1),
  };
}

interface TypingTarget {
  id: string;
  text: string;
  isBookChar: boolean;
}

function buildTargets(verse: Verse, bookName: string): TypingTarget[] {
  const bookTargets: TypingTarget[] = bookName.split('').map((char, i) => ({
    id: `book-${i}`,
    text: char,
    isBookChar: true,
  }));
  const wordTargets: TypingTarget[] = verse.words.map((w) => ({
    id: `word-${w.index}`,
    text: w.text,
    isBookChar: false,
  }));
  return [...bookTargets, ...wordTargets];
}

interface ComposingState {
  cho: string;
  jung: string;
}

const EMPTY_COMPOSING: ComposingState = { cho: '', jung: '' };

export default function ConsonantTypingView({ verse, verseId }: ConsonantTypingViewProps) {
  const router = useRouter();
  const { bookName, chapterVerse } = parseReference(verse.reference);
  const targets = buildTargets(verse, bookName);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [composing, setComposing] = useState<ComposingState>(EMPTY_COMPOSING);
  const [completedTargets, setCompletedTargets] = useState<Set<string>>(new Set());
  const [allDone, setAllDone] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<'hangul' | 'number'>('hangul');

  const currentTarget = targets[currentIdx];
  const currentCharIdx = typedChars.length;
  const expectedChar = currentTarget?.text.split('')[currentCharIdx] ?? '';

  function composingToString(c: ComposingState): string {
    if (!c.cho) return '';
    if (!c.jung) return c.cho;
    return combineHangul(c.cho, c.jung);
  }

  function getCurrentWordDisplay(): string {
    return typedChars.join('') + composingToString(composing);
  }

  const advanceTarget = useCallback(
    (nextIdx: number) => {
      if (nextIdx >= targets.length) {
        setAllDone(true);
      } else {
        setCurrentIdx(nextIdx);
        setTypedChars([]);
        setComposing(EMPTY_COMPOSING);
      }
    },
    [targets.length],
  );

  const commitChar = useCallback(
    (char: string, currentChars: string[]) => {
      const newChars = [...currentChars, char];
      const targetText = currentTarget?.text ?? '';

      // 정답 단어 전체가 완성됐는지 확인
      if (newChars.join('') === targetText) {
        setTypedChars([]);
        setComposing(EMPTY_COMPOSING);
        setCompletedTargets((prev) => new Set([...prev, currentTarget.id]));
        advanceTarget(currentIdx + 1);
      } else {
        setTypedChars(newChars);
        setComposing(EMPTY_COMPOSING);
      }
    },
    [currentTarget, currentIdx, advanceTarget],
  );

  const handleVowel = useCallback(
    (vowel: string) => {
      if (!composing.cho) return;

      // 정답 글자의 받침을 자동으로 주입
      const [, , expectedJong] =
        isHangulChar(expectedChar) ? decomposeHangul(expectedChar) : ['', '', ''];

      const composed = combineHangul(composing.cho, vowel, expectedJong);
      commitChar(composed, typedChars);
    },
    [composing, expectedChar, typedChars, commitChar],
  );

  const handleConsonant = useCallback(
    (consonant: string) => {
      // 기존 초성이 없으면 새 초성 세팅
      setComposing({ cho: consonant, jung: '' });
    },
    [],
  );

  const handleKey = useCallback(
    (key: string) => {
      if (!currentTarget || allDone) return;

      if (isVowel(key)) {
        handleVowel(key);
      } else {
        handleConsonant(key);
      }
    },
    [currentTarget, allDone, handleVowel, handleConsonant],
  );

  const handleDelete = useCallback(() => {
    if (composing.cho) {
      setComposing(EMPTY_COMPOSING);
    } else if (typedChars.length > 0) {
      const prev = typedChars[typedChars.length - 1];
      const [cho] = isHangulChar(prev) ? decomposeHangul(prev) : [prev, '', ''];
      setTypedChars(typedChars.slice(0, -1));
      setComposing({ cho, jung: '' });
    }
  }, [composing, typedChars]);

  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => {
        router.push(`/study/${verseId}/record-intro`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [allDone, router, verseId]);

  function renderBookName() {
    return bookName.split('').map((char, i) => {
      const targetId = `book-${i}`;
      const isCompleted = completedTargets.has(targetId);
      const isCurrent = !allDone && currentTarget?.id === targetId;

      const displayText = allDone || isCompleted
        ? char
        : isCurrent
          ? (getCurrentWordDisplay() || toChosung(char))
          : toChosung(char);

      const color = allDone || isCompleted
        ? '#D7D2DF'
        : isCurrent
          ? '#CCB5F0'
          : '#858585';

      return (
        <span key={i} style={{ color }}>
          {displayText}
        </span>
      );
    });
  }

  function renderWords() {
    return verse.words.map((word) => {
      const targetId = `word-${word.index}`;
      const isCompleted = completedTargets.has(targetId);
      const isCurrent = !allDone && currentTarget?.id === targetId;

      const displayText = allDone || isCompleted
        ? word.text
        : isCurrent
          ? (getCurrentWordDisplay() || toChosung(word.text))
          : toChosung(word.text);

      const color = allDone || isCompleted
        ? '#D7D2DF'
        : isCurrent
          ? '#CCB5F0'
          : '#858585';

      return (
        <span
          key={word.index}
          className="px-1 text-[1.5rem] leading-11.5"
          style={{ color }}
        >
          {displayText}
        </span>
      );
    });
  }

  return (
    <section className="flex flex-col flex-1">
      {/* 키보드가 fixed라 가리지 않도록 하단 여백 확보 */}
      <div
        className="flex flex-col flex-1 justify-center gap-17 px-17"
        style={{ paddingBottom: allDone ? 0 : '13rem' }}
      >
        <p className="text-center text-[1rem] font-medium leading-5 tracking-[0.03em]">
          <span>{renderBookName()}</span>
          {chapterVerse && (
            <span className="text-[#D7D2DF]"> {chapterVerse}</span>
          )}
        </p>

        <div className="flex flex-wrap justify-center">{renderWords()}</div>

        {allDone && (
          <p className="text-center text-[0.875rem] text-[#858585]">잠시 후 다음 단계로...</p>
        )}
      </div>

      {!allDone && (
        <HangulKeyboard
          onKey={handleKey}
          onDelete={handleDelete}
          onSpace={() => {}}
          mode={keyboardMode}
          onModeChange={setKeyboardMode}
        />
      )}
    </section>
  );
}
