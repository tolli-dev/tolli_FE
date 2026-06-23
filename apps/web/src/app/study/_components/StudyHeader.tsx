'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { playSound } from '@/lib/sound';

const TOTAL_STEPS = 7;

interface StudyHeaderProps {
  currentStep: number;
}

export default function StudyHeader({ currentStep }: StudyHeaderProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  // 모달에서 진짜 나가기 (학습 초기화)
  const handleConfirmExit = () => {
    playSound('/sounds/step (0-7) x누르고 진짜 나감 (초기화).mp3');
    router.push('/dashboard');
  };

  // 모달에서 다시 돌아가기 (취소)
  const handleCancelExit = () => {
    playSound('/sounds/step (0-7) x누르고 다시 돌아감.mp3');
    setShowExitModal(false);
  };

  return (
    <>
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-[clamp(1.5rem,8vw,2.5rem)]">
          <div className="w-full max-w-90 flex flex-col items-center rounded-[clamp(1rem,5vw,1.5rem)] bg-[#2A2A2A] px-[clamp(1.25rem,6vw,1.75rem)] py-[clamp(1.5rem,7vw,2rem)]">
            <p className="text-center font-semibold text-[clamp(1rem,4.5vw,1.125rem)] leading-normal text-[#FFFFFF] mb-[clamp(0.375rem,2vw,0.625rem)] whitespace-nowrap">
              학습을 그만둘까요?
            </p>
            <p className="text-center font-light text-[clamp(0.8125rem,3.5vw,0.875rem)] leading-normal text-[#B0B0B0] break-keep mb-[clamp(1.25rem,6vw,1.75rem)] whitespace-nowrap">
              지금 나가면 진행한 내용이 저장되지 않아요.
            </p>
            <div className="flex w-full gap-[clamp(0.5rem,2.5vw,0.75rem)]">
              <button
                type="button"
                onClick={handleCancelExit}
                className="flex-1 rounded-[clamp(0.875rem,4vw,1.25rem)] bg-[#4A4A4A] py-[clamp(0.625rem,3vw,0.8125rem)] font-semibold text-[clamp(0.875rem,4vw,1rem)] text-[#CCB5F0]"
              >
                계속하기
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="flex-1 rounded-[clamp(0.875rem,4vw,1.25rem)] bg-[#CCB5F0] py-[clamp(0.625rem,3vw,0.8125rem)] font-semibold text-[clamp(0.875rem,4vw,1rem)] text-[#1B1B1B]"
              >
                그만두기
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center gap-5.5 px-8 pt-5 pb-3">
        <span className="text-[1rem] font-medium leading-5 tracking-[0.03em] text-[#A6A6A6]">
          {currentStep}/{TOTAL_STEPS}
        </span>

        <div className="relative flex-1 h-1.75 rounded-[5px] overflow-hidden bg-[rgba(217,217,217,0.2)] backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.2)]">
          <div
            className="absolute top-0 left-0 h-full rounded-[5px] bg-[#CCB5F0] transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <button onClick={() => setShowExitModal(true)} aria-label="닫기">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 1.40039L8.40039 7L14 12.5996L12.5996 14L7 8.40039L1.40039 14L0 12.5996L5.59961 7L0 1.40039L1.40039 0L7 5.59961L12.5996 0L14 1.40039Z"
              fill="#CCB5F0"
              stroke="#CCB5F0"
            />
          </svg>
        </button>
      </header>
    </>
  );
}
