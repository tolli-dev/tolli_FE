'use client';

import { useRouter } from 'next/navigation';

const TOTAL_STEPS = 7;

interface StudyHeaderProps {
  currentStep: number;
}

export default function StudyHeader({ currentStep }: StudyHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.push("/dashboard");
  };

  return (
    <header className="flex items-center gap-5.5 px-8 pt-5 pb-3">
      <button onClick={handleBack} aria-label="뒤로가기">
        <svg
          width="9"
          height="16"
          viewBox="0 0 9 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.66667 1L1 7.66667L7.66667 14.3333"
            stroke="#CCB5F0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="relative flex-1 h-1.75 rounded-[5px] overflow-hidden bg-[rgba(217,217,217,0.2)] backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.2)]">
        <div
          className="absolute top-0 left-0 h-full rounded-[5px] bg-[#CCB5F0] transition-all duration-300"
          style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <button onClick={handleClose} aria-label="닫기">
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
  );
}
