import { MOCK_STUDY_SESSION } from "../../_components/types";
import MultipleChoiceView from "../../_components/MultipleChoiceView";
import ReadVerse from "../../_components/step0/ReadVerse";
import TabVerse from "../../_components/step1/TabVerse";

interface StudyPageProps {
  params: Promise<{ verseId: string; step: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { verseId, step } = await params;
  const currentStep = Number(step);

  // TODO: 백엔드 연동 시 교체 해야함.
  const session = MOCK_STUDY_SESSION;

  const stepMaskData = session.stepMasks.find((s) => s.step === currentStep);

  switch (currentStep) {
    case 0:
      return <ReadVerse verse={session.verse} verseId={verseId} />;

    case 1:
      return <TabVerse verse={session.verse} verseId={verseId} />;

    case 2:
    case 3:
    case 4:
    case 5:
      if (!stepMaskData) return null;
      return (
        <MultipleChoiceView
          step={currentStep as 2 | 3 | 4 | 5}
          verse={session.verse}
          stepMaskData={stepMaskData}
          verseId={verseId}
        />
      );

    case 6:
      // TODO: 나중에
      return <div>Step 6: 자음 타이핑 (구현 예정)</div>;

    default:
      return null;
  }
}
