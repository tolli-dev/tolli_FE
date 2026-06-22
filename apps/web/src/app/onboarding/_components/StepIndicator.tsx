interface Props {
  totalSteps: number;
  currentStep: number;
}

export default function StepIndicator({ totalSteps, currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-4.5 pb-6.75 pt-12.75 pl-8.5 ">
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
