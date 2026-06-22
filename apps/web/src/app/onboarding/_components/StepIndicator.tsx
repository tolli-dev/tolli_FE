interface Props {
  totalSteps: number;
  currentStep: number;
}

export default function StepIndicator({ totalSteps, currentStep }: Props) {
  return (
    <div className="flex items-center justify-start gap-4.5 pb-[clamp(1.25rem,8vw,2rem)] pt-[clamp(2.5rem,15vw,3.75rem)]">
      {Array.from({ length: totalSteps }, (_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all duration-300 ${
            i === currentStep
              ? "w-1.75 h-1.75 bg-primary-50"
              : "w-1.75 h-1.75 bg-surface-100"
          }`}
        />
      ))}
    </div>
  );
}
