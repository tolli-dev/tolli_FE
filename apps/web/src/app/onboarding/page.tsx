"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingActions from "@/app/onboarding/_components/OnboardingActions";
import LearningSteps from "./_components/LearningSteps";
import StepIndicator from "./_components/StepIndicator";
import OnboardingSlide from "./_components/OnboardingSlide";
import SlideWrapper from "./_components/SlideWrapper";

const STEPS = [
  {
    title: "말씀이 필요한 순간\n떠오르도록",
    description: "읽고 지나가는 것이 아니라\n마음에 남아 입으로 나오게 합니다.",
    image: "/tolli1.webp",
    imageSize: "16.375rem",
  },
  {
    title: "보는 것에서 기억으로",
    description: "한 구절을 따라가다 보면,\n어느 순간 입으로 말하게 됩니다.",
    image: "/tolli2.webp",
    imageSize: "19.625rem",
    extra: <LearningSteps />,
  },
  {
    title: "매일 5분, 한 구절이면\n충분합니다",
    description:
      "그 말씀이 오늘의 생각이 되고\n오늘의 말이 됩니다\n매일, 일용할 양식을 드릴게요.",
    image: "/tolli3.webp",
    imageSize: "19.375rem",
  },
];

const TOTAL_STEPS = STEPS.length;

type SlidePhase = "idle" | "exit" | "enter";

export default function OnboardingStepPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<SlidePhase>("idle");
  const nextRef = useRef<number | "login" | null>(null);

  const current = STEPS[step];
  const isLastStep = step === TOTAL_STEPS - 1;

  useEffect(() => {
    STEPS.forEach((s) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = s.image;
      document.head.appendChild(link);
    });
    router.prefetch("/login");
  }, [router]);

  const notifyOnboardingComplete = () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "ONBOARDING_COMPLETE" }),
    );
  };

  const navigate = (dest: number | "login") => {
    if (phase !== "idle") return;
    nextRef.current = dest;
    setPhase("exit");
  };

  const handleAnimationEnd = () => {
    if (phase === "exit") {
      const dest = nextRef.current;
      if (dest === "login") {
        notifyOnboardingComplete();
        router.push("/login");
        return;
      }
      if (dest !== null) setStep(dest as number);
      nextRef.current = null;
      setPhase("enter");
    } else if (phase === "enter") {
      setPhase("idle");
    }
  };

  const handleNext = () => navigate(isLastStep ? "login" : step + 1);
  const handleSkip = () => {
    notifyOnboardingComplete();
    router.push("/login");
  };

  const slideClass =
    phase === "exit"
      ? "onboarding-slide-exit"
      : phase === "enter"
        ? "onboarding-slide-enter"
        : "";

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
