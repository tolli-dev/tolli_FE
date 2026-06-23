"use client";

import Button from "@/components/ui/Button";

interface OnboardingActionsProps {
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingActions({
  isLastStep,
  onNext,
  onSkip,
}: OnboardingActionsProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full px-[clamp(0.75rem,7vw,1.5rem)] pb-[clamp(1.75rem,10vw,2.5rem)]">
      <Button onClick={onNext}>{isLastStep ? "시작하기" : "다음"}</Button>

      <button
        type="button"
        onClick={onSkip}
        className={`text-btn-sm text-surface-300 underline py-[clamp(0.5rem,3vw,0.8125rem)] ${
          isLastStep ? "invisible" : ""
        }`}
      >
        건너뛰기
      </button>
    </div>
  );
}
