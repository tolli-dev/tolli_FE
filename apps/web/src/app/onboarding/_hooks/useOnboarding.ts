import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LearningSteps from "../_components/LearningSteps";
import { useSlideAnimation } from "./useSlideAnimation";

const STEPS = [
  {
    title: "말씀이 필요한 순간\n떠오르도록",
    description: "읽고 지나가는 것이 아니라\n마음에 남아 입으로 나오게 합니다.",
    image: "/tolli1.webp",
    imageSize: "clamp(12rem, 70vw, 16.375rem)",
  },
  {
    title: "보는 것에서 기억으로",
    description: "한 구절을 따라가다 보면,\n어느 순간 입으로 말하게 됩니다.",
    image: "/tolli2.webp",
    imageSize: "clamp(14rem, 84vw, 19.625rem)",
    extra: LearningSteps,
  },
  {
    title: "매일 5분, 한 구절이면\n충분합니다",
    description:
      "그 말씀이 오늘의 생각이 되고\n오늘의 말이 됩니다\n매일, 일용할 양식을 드릴게요.",
    image: "/tolli3.webp",
    imageSize: "clamp(14rem, 83vw, 19.375rem)",
  },
];

const TOTAL_STEPS = STEPS.length;

export function useOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { startTransition, handleAnimationEnd, slideClass } = useSlideAnimation(
    (destination) => {
      if (destination === "login") {
        notifyOnboardingComplete();
        router.push("/login");
        return false;
      }
      setStep(destination);
      return true;
    },
  );

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

  const handleNext = () => startTransition(isLastStep ? "login" : step + 1);
  const handleSkip = () => {
    notifyOnboardingComplete();
    router.push("/login");
  };

  return {
    step,
    current,
    isLastStep,
    handleAnimationEnd,
    handleNext,
    handleSkip,
    slideClass,
    TOTAL_STEPS,
  };
}
