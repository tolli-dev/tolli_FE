import { getVerse } from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";
import { notFound } from "next/navigation";
import { Verse, StepMaskData } from "./_components/types";
import MultipleChoiceView from "./_components/step2-5/MultipleChoiceView";
import ConsonantTypingView from "./_components/step6/ConsonantTypingView";
import ReadVerse from "./_components/step0/ReadVerse";
import TabVerse from "./_components/step1/TabVerse";
import Record from "./_components/step7/Record";

interface StudyPageProps {
  params: Promise<{ verseId: string; step: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { verseId, step } = await params;
  const currentStep = Number(step);

  const result = await getVerse(dataConnect, { id: Number(verseId) });
  const verseData = result.data.verse;
  if (!verseData) return notFound();

  const verse: Verse = {
    id: verseData.id,
    reference: verseData.reference,
    words: verseData.words as Verse["words"],
  };

  const allIndices = verse.words.map((w) => w.index);

  const stepMaskMap: Record<number, StepMaskData> = {
    2: { step: 2, maskedIndices: verseData.maskedStep2 },
    3: { step: 3, maskedIndices: verseData.maskedStep3 },
    4: { step: 4, maskedIndices: verseData.maskedStep4 },
    5: { step: 5, maskedIndices: allIndices },
  };

  const stepMaskData = stepMaskMap[currentStep];

  switch (currentStep) {
    case 0:
      return <ReadVerse verse={verse} verseId={verseId} />;
    case 1:
      return (
        <TabVerse verse={verse} meanings={verse.words} verseId={verseId} />
      );
    case 2:
    case 3:
    case 4:
    case 5:
      if (!stepMaskData) return null;
      return (
        <MultipleChoiceView
          step={currentStep as 2 | 3 | 4 | 5}
          verse={verse}
          stepMaskData={stepMaskData}
          verseId={verseId}
        />
      );
    case 6:
      return <ConsonantTypingView verse={verse} verseId={verseId} />;
    case 7:
      return <Record verseId={Number(verseId)} />;
    default:
      return null;
  }
}
