import StepIndicator from "@/app/onBoarding/_components/StepIndicator";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full justify-center items-start">
      <StepIndicator />
      <div className="flex flex-col flex-1 w-full h-full">{children}</div>
    </div>
  );
}
