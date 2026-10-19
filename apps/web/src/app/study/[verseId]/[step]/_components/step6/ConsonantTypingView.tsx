'use client';

import { useReducer, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Verse } from '../types';
import HangulKeyboard from './HangulKeyboard';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { isVowel, isHangulChar, getChosung, composeWithAnswer } from './hangul';

interface ConsonantTypingViewProps {
  verse: Verse;
  verseId: string;
}

function parseReference(reference: string): { bookName: string; chapterVerse: string } {
  const spaceIdx = reference.lastIndexOf(' ');
  if (spaceIdx < 0) return { bookName: reference, chapterVerse: '' };
  return { bookName: reference.slice(0, spaceIdx), chapterVerse: reference.slice(spaceIdx + 1) };
}

interface TypingTarget {
  id: string;
  text: string;
  isBookName: boolean;
}

function buildTargets(verse: Verse, bookName: string): TypingTarget[] {
  return [
    { id: 'book', text: bookName, isBookName: true },
    ...verse.words.map((w) => ({ id: `word-${w.index}`, text: w.text, isBookName: false })),
  ];
}

interface State {
  targetIdx: number;
  typedChars: string[];
  completedIds: Set<string>;
  allDone: boolean;
  // 같은 키를 연달아 틀려도 테두리가 다시 켜지도록 횟수를 함께 둔다
  wrong: { key: string; count: number } | null;
}

type Action = { type: 'KEY'; key: string; targets: TypingTarget[] } | { type: 'CLEAR_WRONG' };

// 모음 하나를 정답 글자의 초성·받침과 합쳐 맞으면 넣고, 틀리면 wrong 에 남긴다
function reducer(state: State, action: Action): State {
  if (action.type === 'CLEAR_WRONG') return { ...state, wrong: null };
  if (state.allDone) return state;

  const { targetIdx, typedChars, completedIds } = state;
  const { key, targets } = action;
  const target = targets[targetIdx];
  if (!target || !isVowel(key)) return state;

  const expectedChar = target.text[typedChars.length] ?? '';
  // 한글이 아닌 글자(문장부호 등)는 어떤 모음으로든 넘긴다
  const composed = isHangulChar(expectedChar) ? composeWithAnswer(expectedChar, key) : expectedChar;
  if (composed !== expectedChar) {
    return { ...state, wrong: { key, count: (state.wrong?.count ?? 0) + 1 } };
  }

  const newChars = [...typedChars, composed];
  if (newChars.join('') !== target.text) {
    return { ...state, typedChars: newChars, wrong: null };
  }

  const newCompleted = new Set([...completedIds, target.id]);
  const nextIdx = targetIdx + 1;
  if (nextIdx >= targets.length) {
    return { ...state, typedChars: [], completedIds: newCompleted, allDone: true, wrong: null };
  }
  return { ...state, targetIdx: nextIdx, typedChars: [], completedIds: newCompleted, wrong: null };
}

// 어절을 글자별로 나눠 렌더: 완성(보라) | 현재 포커스(흰) | 미입력(회색)
function renderWordChars(
  text: string,
  typedChars: string[],
  isCurrent: boolean,
  isCompleted: boolean,
  allDone: boolean,
  className = '',
): React.ReactNode {
  return text.split('').map((char, i) => {
    let display: string;
    let color: string;

    if (allDone || isCompleted) {
      display = char;
      color = '#CCB5F0';
    } else if (!isCurrent) {
      display = getChosung(char) || char;
      color = '#858585';
    } else if (i < typedChars.length) {
      display = typedChars[i];
      color = '#CCB5F0';
    } else {
      display = getChosung(char) || char;
      color = i === typedChars.length ? '#FFFFFF' : '#858585';
    }

    return (
      <span key={i} className={className} style={{ color }}>
        {display}
      </span>
    );
  });
}

export default function ConsonantTypingView({ verse, verseId }: ConsonantTypingViewProps) {
  const router = useRouter();
  const { bookName, chapterVerse } = parseReference(verse.reference);

  const targets = useMemo(() => buildTargets(verse, bookName), [verse, bookName]);

  const playTypingSound = useSoundEffect('/sounds/타자소리 타이핑 소리.mp3');

  const [state, dispatch] = useReducer(reducer, {
    targetIdx: 0,
    typedChars: [],
    completedIds: new Set<string>(),
    allDone: false,
    wrong: null,
  });

  const { targetIdx, typedChars, completedIds, allDone, wrong } = state;

  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => router.push(`/study/${verseId}/record-intro`), 3000);
      return () => clearTimeout(timer);
    }
  }, [allDone, router, verseId]);

  useEffect(() => {
    if (!wrong) return;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_WRONG' }), 500);
    return () => clearTimeout(timer);
  }, [wrong]);

  return (
    <section className="flex flex-col flex-1">
      <div
        className="flex flex-col mt-[clamp(5rem,20vh,10rem)] justify-center gap-[clamp(2rem,8vw,4.25rem)] px-[clamp(1.5rem,9vw,4.25rem)]"
        style={{ paddingBottom: '13rem' }}
      >
        <p className="text-center text-[clamp(1rem,4.5vw,1.25rem)] font-medium leading-6 tracking-[0.03em]">
          {renderWordChars(
            bookName,
            targetIdx === 0 ? typedChars : bookName.split(''),
            targetIdx === 0,
            completedIds.has('book'),
            allDone,
          )}
          {chapterVerse && <span className="text-[#CCB5F0]"> {chapterVerse}</span>}
        </p>

        <div className="flex flex-wrap justify-center">
          {verse.words.map((word, wi) => {
            const id = `word-${word.index}`;
            const isCompleted = completedIds.has(id);
            const isCurrent = !allDone && targetIdx === wi + 1;

            return (
              <span
                key={word.index}
                className="px-1 text-[clamp(1.5rem,6vw,2rem)] leading-[clamp(2.5rem,9vw,3.5rem)]"
              >
                {renderWordChars(
                  word.text,
                  isCurrent ? typedChars : isCompleted || allDone ? word.text.split('') : [],
                  isCurrent,
                  isCompleted,
                  allDone,
                )}
              </span>
            );
          })}
        </div>
      </div>

      {!allDone && (
        <HangulKeyboard
          wrongKey={wrong?.key ?? null}
          onKey={(key) => {
            playTypingSound();
            dispatch({ type: 'KEY', key, targets });
          }}
        />
      )}
    </section>
  );
}
