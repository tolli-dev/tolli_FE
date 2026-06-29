'use client';

import { useReducer, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Verse } from '../types';
import HangulKeyboard from './HangulKeyboard';
import { playSound } from '@/lib/sound';
import {
  isVowel,
  isHangulChar,
  combineHangul,
  decomposeHangul,
  getChosung,
  resolveVowel,
} from './hangul';

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
  cho: string;
  completedIds: Set<string>;
  allDone: boolean;
}

type Action = { type: 'KEY'; key: string; targets: TypingTarget[] };

// 입력 상태 전이: 모음 입력 시 초성 자동완성 + 받침 자동완성, 틀린 입력은 막음
function reducer(state: State, action: Action): State {
  if (state.allDone) return state;

  const { targetIdx, typedChars, cho, completedIds } = state;

  const { key, targets } = action;
  const target = targets[targetIdx];
  if (!target) return state;

  const expectedChar = target.text[typedChars.length] ?? '';
  const expectedCho = isHangulChar(expectedChar) ? getChosung(expectedChar) : expectedChar;

  if (isVowel(key)) {
    // 초성 미입력 시 정답 초성 자동 사용, 받침도 정답에서 자동 주입
    const activeCho = cho || expectedCho;
    if (!activeCho) return state;

    const [, expectedJung, jong] = isHangulChar(expectedChar)
      ? decomposeHangul(expectedChar)
      : ['', key, ''];
    // 단일 모음으로 복합모음 자동 승격 (ㅡ -> ㅢ 등)
    const activeJung = resolveVowel(key, expectedJung);
    const composed = combineHangul(activeCho, activeJung, jong);
    if (composed !== expectedChar) return state;

    const newChars = [...typedChars, composed];

    if (newChars.join('') === target.text) {
      const newCompleted = new Set([...completedIds, target.id]);
      const nextIdx = targetIdx + 1;
      if (nextIdx >= targets.length) {
        return { ...state, typedChars: [], cho: '', completedIds: newCompleted, allDone: true };
      }
      return { ...state, targetIdx: nextIdx, typedChars: [], cho: '', completedIds: newCompleted };
    }

    return { ...state, typedChars: newChars, cho: '' };
  } else {
    // 자음은 정답 초성과 일치할 때만 허용 (틀린 자음 차단)
    if (key !== expectedCho) return state;
    return { ...state, cho: key };
  }
}

// 어절을 글자별로 나눠 렌더: 완성(보라) | 현재 포커스(흰) | 미입력(회색)
function renderWordChars(
  text: string,
  typedChars: string[],
  cho: string,
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
    } else {
      if (i < typedChars.length) {
        display = typedChars[i];
        color = '#CCB5F0';
      } else if (i === typedChars.length) {
        display = cho || getChosung(char) || char;
        color = '#FFFFFF';
      } else {
        display = getChosung(char) || char;
        color = '#858585';
      }
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

  const [wrongKey, setWrongKey] = useState<string | null>(null);

  const [state, dispatch] = useReducer(reducer, {
    targetIdx: 0,
    typedChars: [],
    cho: '',
    completedIds: new Set<string>(),
    allDone: false,
  });

  const { targetIdx, typedChars, cho, completedIds, allDone } = state;

  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => router.push(`/study/${verseId}/record-intro`), 3000);
      return () => clearTimeout(timer);
    }
  }, [allDone, router, verseId]);

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
            targetIdx === 0 ? cho : '',
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
              <span key={word.index} className="px-1 text-[clamp(1.5rem,6vw,2rem)] leading-[clamp(2.5rem,9vw,3.5rem)]">
                {renderWordChars(
                  word.text,
                  isCurrent ? typedChars : isCompleted || allDone ? word.text.split('') : [],
                  isCurrent ? cho : '',
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
          wrongKey={wrongKey}
          onKey={(key) => {
            playSound('/sounds/타자소리 타이핑 소리.mp3');
            const target = targets[state.targetIdx];
            if (target && isVowel(key)) {
              const expectedChar = target.text[state.typedChars.length] ?? '';
              if (isHangulChar(expectedChar)) {
                const activeCho = state.cho || getChosung(expectedChar);
                const [, expectedJung, jong] = decomposeHangul(expectedChar);
                const activeJung = resolveVowel(key, expectedJung);
                const composed = combineHangul(activeCho, activeJung, jong);
                if (composed !== expectedChar) {
                  setWrongKey(key);
                  setTimeout(() => setWrongKey(null), 500);
                }
              }
            }
            dispatch({ type: 'KEY', key, targets });
          }}
        />
      )}
    </section>
  );
}
