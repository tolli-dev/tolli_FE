"use client";

import OnboardingActions from "@/app/onboarding/_components/OnboardingActions";
import StepIndicator from "./_components/StepIndicator";
import OnboardingSlide from "./_components/OnboardingSlide";
import SlideWrapper from "./_components/SlideWrapper";
import { useOnboarding } from "./_hooks/useOnboarding";

export default function OnboardingStepPage() {
  const {
    step,
    current,
    isLastStep,
    handleAnimationEnd,
    handleNext,
    handleSkip,
    slideClass,
    TOTAL_STEPS,
  } = useOnboarding();

  return (
    <>
      <StepIndicator totalSteps={TOTAL_STEPS} currentStep={step} />

      <SlideWrapper
        handleAnimationEnd={handleAnimationEnd}
        slideClass={slideClass}
      >
        <OnboardingSlide current={current} />
      </SlideWrapper>

      <OnboardingActions
        isLastStep={isLastStep}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </>
  );
}
