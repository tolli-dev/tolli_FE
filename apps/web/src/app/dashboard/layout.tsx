export default function MainDashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-dvh overflow-hidden justify-center items-start">
      <div className="flex flex-col flex-1 w-full h-full min-h-0">
        {children}
      </div>
    </div>
  );
}
