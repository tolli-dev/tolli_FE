'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TOTAL_STEPS = 7;

interface StudyHeaderProps {
  currentStep: number;
}

export default function StudyHeader({ currentStep }: StudyHeaderProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleConfirmExit = () => {
    router.push('/dashboard');
  };

  return (
    <>
      {showExitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
          onClick={() => setShowExitModal(false)}
        >
          <div
            className="w-[80vw] max-w-88 rounded-4xl overflow-hidden flex flex-col items-center px-6 pt-8 pb-8 gap-4 bg-[#1e1e1e]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[1.1875rem] leading-7.75 text-[#CCB5F0] text-center">
              지금 나가면 진행이 저장되지 않아요
            </h2>
            <div className="flex flex-col w-full gap-3 mt-2">
              <button
                onClick={handleConfirmExit}
                className="w-full h-12 rounded-[1.25rem] text-[1rem] font-semibold text-black bg-[#CCB5F0]"
              >
                나가기
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full h-12 rounded-[1.25rem] text-[1rem] font-semibold text-black bg-[#D9D9D9]"
              >
                계속하기
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
