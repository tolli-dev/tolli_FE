interface Props {
  children: React.ReactNode;
  handleAnimationEnd: () => void;
  slideClass: "" | "onboarding-slide-exit" | "onboarding-slide-enter";
}

export default function SlideWrapper({
  children,
  slideClass,
  handleAnimationEnd,
}: Props) {
  return (
    <div
      className={`flex flex-col flex-1 w-full ${slideClass}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}
