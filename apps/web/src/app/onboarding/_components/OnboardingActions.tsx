'use client';

import Button from '@/components/ui/Button';

interface OnboardingActionsProps {
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingActions({ isLastStep, onNext, onSkip }: OnboardingActionsProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full px-10.75">
      <Button onClick={onNext}>{isLastStep ? '시작하기' : '다음'}</Button>
      {isLastStep ? (
        <div className="text-btn-sm">&nbsp;</div>
      ) : (
        <button type="button" onClick={onSkip} className="text-btn-sm text-surface-300 underline">
          건너뛰기
        </button>
      )}
    </div>
  );
}
