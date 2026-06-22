export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full justify-center items-start overflow-hidden">
      {children}
    </div>
  );
}
