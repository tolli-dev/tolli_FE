import StepIndicator from '@/app/onboarding/_components/StepIndicator';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <StepIndicator />
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
}
