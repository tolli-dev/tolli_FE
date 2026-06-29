export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full justify-center items-start overflow-hidden px-[clamp(1.25rem,8vw,1.75rem)]">
      {children}
    </div>
  );
}
