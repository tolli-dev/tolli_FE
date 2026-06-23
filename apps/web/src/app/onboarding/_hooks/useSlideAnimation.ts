import { useRef, useState } from "react";

type SlidePhase = "idle" | "exit" | "enter";

export function useSlideAnimation(
  onExit: (destination: number | "login") => boolean,
) {
  const [phase, setPhase] = useState<SlidePhase>("idle");
  const nextRef = useRef<number | "login" | null>(null);

  const startTransition = (dest: number | "login") => {
    if (phase !== "idle") return;
    nextRef.current = dest;
    setPhase("exit");
  };

  const handleAnimationEnd = () => {
    if (phase === "exit") {
      const destination = nextRef.current;
      nextRef.current = null;
      if (destination !== null && onExit(destination)) {
        setPhase("enter");
      }
    } else if (phase === "enter") {
      setPhase("idle");
    }
  };

  const slideClass =
    phase === "exit"
      ? "onboarding-slide-exit"
      : phase === "enter"
        ? "onboarding-slide-enter"
        : "";

  return { startTransition, handleAnimationEnd, slideClass };
}
