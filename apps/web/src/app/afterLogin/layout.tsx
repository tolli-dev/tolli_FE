import StepIndicator from '@/app/onboarding/_components/StepIndicator';

export default function AfterLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full justify-center items-start">
      <div className="flex flex-col flex-1 w-full h-full">{children}</div>
    </div>
  );
}
