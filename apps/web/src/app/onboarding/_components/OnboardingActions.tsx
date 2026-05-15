'use client';

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
    <div className="flex flex-col items-center gap-4 w-full px-6 pb-8">
      <button
        type="button"
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-primary-200 text-surface-50 text-btn-lg"
      >
        {isLastStep ? '시작하기' : '다음'}
      </button>

      {!isLastStep && (
        <button
          type="button"
          onClick={onSkip}
          className="text-btn-sm text-surface-300"
        >
          건너뛰기
        </button>
      )}
    </div>
  );
}
