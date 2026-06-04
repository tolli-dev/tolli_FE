import { MOCK_STUDY_SESSION } from "../../_components/types";
import MultipleChoiceView from "../../_components/step2-5/MultipleChoiceView";
import ConsonantTypingView from "../../_components/step6/ConsonantTypingView";
import ReadVerse from "../../_components/step0/ReadVerse";
import TabVerse from "../../_components/step1/TabVerse";
import Record from "../../_components/step7/Record";

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
      return (
        <TabVerse
          verse={session.verse}
          meanings={session.wordMeanings}
          verseId={verseId}
        />
      );
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
      return <ConsonantTypingView verse={session.verse} verseId={verseId} />;

    case 7:
      return <Record />;

    default:
      return null;
  }
}
