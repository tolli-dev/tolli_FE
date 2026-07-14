'use client';

import { Icon } from '@iconify/react';
import Bookmark from '../../_components/Bookmark';
import { useListenAudio } from './hooks/useListenAudio';
import { useStudyComplete } from '../../_hooks/useStudyComplete';

interface ListenViewProps {
  verseId: number;
  verseText: string;
  reference: string;
  todayCount: number;
}

export default function ListenView({ verseId, verseText, reference, todayCount }: ListenViewProps) {
  const { played, showHome, toggle, stopAll } = useListenAudio(verseId);
  const { submitError, bookmarkModal, handleComplete, clearError } = useStudyComplete(verseId);

  const handleCompleteWithStop = () => {
    stopAll();
    handleComplete();
  };

  return (
    <section
      className="listenVerse-layout flex flex-col w-full h-full items-center overflow-hidden
      px-[clamp(1.5rem,10.8vw,2.625rem)]
      pt-[clamp(2.5rem,13.6vw,3.3125rem)]
      pb-[clamp(1.25rem,7.7vw,1.875rem)]"
    >
      <div className="flex flex-col items-center shrink-0 gap-[clamp(0.625rem,3.3vw,0.8125rem)] mb-[clamp(1.125rem,5.9vw,1.4375rem)]">
        <h2 className="text-center text-[#1B1B1B] font-bold text-[clamp(1.375rem,6.7vw,1.625rem)] leading-[clamp(1.75rem,8.7vw,2.125rem)]">
          오늘의 목소리를
          <br />
          들어보세요
        </h2>
        <div className="flex flex-row items-center justify-center gap-[clamp(0.25rem,1.75vw,0.4375rem)]">
          <Icon
            icon="fluent:people-20-filled"
            className="text-[#383838] text-[clamp(1rem,5.25vw,1.3125rem)]"
          />
          <h4 className="text-[#202020] font-medium text-[clamp(0.8125rem,4vw,1rem)] whitespace-nowrap">
            오늘 <span className="text-[#383838]">{todayCount}</span>명이 함께 읽고 있어요
          </h4>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0 overflow-hidden w-full rounded-[clamp(2.5rem,12.8vw,3.125rem)] mb-[clamp(1.5rem,8vw,3.5rem)] z-10 bg-white/10 backdrop-blur-xs">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[clamp(2.5rem,12.8vw,3.125rem)]"
          style={{
            padding: '3px',
            background: 'linear-gradient(to bottom left, #7A7A7A, #917DB0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />
        <div className="flex flex-col w-full h-full px-[clamp(2.5rem,14.9vw,3.625rem)] py-[clamp(1.5rem,8.5vw,2.0625rem)]">
          <div className="flex flex-1 min-h-0 items-center justify-center">
            <p className="text-[clamp(1.0625rem,5.1vw,1.25rem)] leading-[clamp(1.625rem,7.9vw,1.9375rem)] tracking-[-2%] text-[#1B1B1B] text-center break-keep">
              {verseText}
            </p>
          </div>
          <p className="shrink-0 text-[clamp(0.875rem,4.1vw,1rem)] leading-[clamp(1.125rem,5.1vw,1.25rem)] tracking-[3%] text-[#282828] text-center">
            {reference}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={played ? '일시정지' : '재생'}
        className="relative flex shrink-0 items-center justify-center rounded-full bg-[#CCB5F0]
        w-[clamp(3.5rem,16.9vw,4.125rem)] h-[clamp(3.5rem,16.9vw,4.125rem)]
        mb-[clamp(1rem,6vw,2.625rem)]"
      >
        {played ? (
          <div className="flex items-center gap-[clamp(0.25rem,1.5vw,0.375rem)]">
            <span className="w-[clamp(0.375rem,1.8vw,0.4375rem)] h-[clamp(1.375rem,6.9vw,1.6875rem)] rounded-xs bg-[#2E2E2E]" />
            <span className="w-[clamp(0.375rem,1.8vw,0.4375rem)] h-[clamp(1.375rem,6.9vw,1.6875rem)] rounded-xs bg-[#2E2E2E]" />
          </div>
        ) : (
          <div className="w-[clamp(1.125rem,5.6vw,1.375rem)] h-[clamp(1.375rem,6.9vw,1.6875rem)] translate-x-0.5 bg-[#2E2E2E] [clip-path:polygon(0%_0%,100%_50%,0%_100%)]" />
        )}
      </button>

      <button
        type="button"
        onClick={handleCompleteWithStop}
        aria-label="홈으로 이동"
        className={`w-full shrink-0 bg-[#CCB5F0] flex items-center justify-center
          py-[clamp(0.625rem,3.3vw,0.8125rem)] rounded-[clamp(1rem,5vw,1.25rem)]
          text-[clamp(0.875rem,4vw,1rem)]
          ${showHome ? '' : 'invisible pointer-events-none'}`}
      >
        홈으로
      </button>

      {bookmarkModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#000000]/60">
          <Bookmark verseId={verseId} />
        </div>
      )}

      {submitError && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-60 bg-[#000000]/60 px-[clamp(1.5rem,8vw,2.5rem)]">
          <div className="bg-white w-full rounded-[clamp(1.5rem,8vw,2rem)] p-[clamp(1.5rem,8vw,2rem)] flex flex-col items-center gap-[clamp(1rem,5vw,1.5rem)] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col items-center gap-[clamp(0.5rem,2vw,0.75rem)]">
              <h3 className="text-[#1B1B1B] font-bold text-[clamp(1.125rem,5vw,1.25rem)] text-center whitespace-nowrap">
                학습 완료에 실패했어요
              </h3>
              <p className="text-[#383838] text-[clamp(0.875rem,4vw,1rem)] text-center whitespace-nowrap leading-relaxed">
                학습 데이터를 저장하는 중 문제가 발생했습니다.
                <br />
                잠시 후 다시 시도해주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="w-full bg-[#CCB5F0] text-[#1B1B1B] font-bold py-[clamp(0.875rem,4.5vw,1.125rem)] rounded-[clamp(1rem,5vw,1.25rem)] text-[clamp(0.875rem,4vw,1rem)] mt-[clamp(0.5rem,2vw,1rem)] whitespace-nowrap"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
