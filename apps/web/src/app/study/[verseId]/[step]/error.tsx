"use client";

interface Props {
  reset: () => void;
}

export default function StudyStepError({ reset }: Props) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-[clamp(1rem,4.8vw,1.875rem)] w-full px-[2.688rem]">
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[clamp(0.9375rem,4.4vw,1.0625rem)] leading-[clamp(1.375rem,6.6vw,1.625rem)] text-[#494949]">
          말씀을 불러오지 못했어요
        </p>
        <p className="text-[clamp(0.9375rem,4.4vw,1.0625rem)] leading-[clamp(1.375rem,6.6vw,1.625rem)] text-[#494949]">
          잠시 후 다시 시도해주세요
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="w-full rounded-[1.25rem] bg-[#CCB5F0] py-[clamp(0.625rem,3.3vw,0.8125rem)] font-bold text-[clamp(1rem,4.6vw,1.125rem)] leading-[clamp(1.25rem,5.9vw,1.4375rem)] text-[#1B1B1B]"
      >
        다시 시도
      </button>
    </div>
  );
}
