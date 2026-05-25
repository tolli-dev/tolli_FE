import StudyHeader from "../../_components/StudyHeader";

interface StudyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ verseId: string; step: string }>;
}

export default async function StudyLayout({
  children,
  params,
}: StudyLayoutProps) {
  const { step } = await params;

  return (
    <div className="flex flex-col h-full ">
      <StudyHeader currentStep={Number(step)} />
      <div className="flex flex-col flex-1 w-full">{children}</div>
    </div>
  );
}
