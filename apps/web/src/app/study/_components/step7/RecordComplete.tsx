import CompleteContainer from "./_components/center/CompleteContainer";
import DiffHeader from "./_components/header/DiffHeader";
import RecordButton from "./_components/button/RecordButton";
import { useRouter, useParams } from "next/navigation";
import RetryRecordingButton from "./_components/button/RetryRecordingButton";
import { createStudyCompletion } from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";

export default function RecordComplete({
  retryRecording,
  verseId,
}: {
  retryRecording: () => void;
  verseId: number;
}) {
  const router = useRouter();
  const { verseId } = useParams();

  const stopRecording = async () => {
    await createStudyCompletion(dataConnect, { verseId });
    router.push(`/study/${verseId}/completeRecording`);
  };

  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-4 px-10.5">
      <header>
        <DiffHeader
          instruction1="좋아요, 말씀을 소리 내어 말했어요"
          instruction2="잘했어요! 한 걸음 더 성장했어요"
        />
      </header>

      <main className="flex flex-col flex-1 items-center justify-center gap-[5.47vw] w-full mb-[22.64vw]">
        <CompleteContainer />
        <p className="font-semibold text-[3.98vw] leading-[8.46vw] text-[#B0B0B0]">
          한 번 더 해보고 싶다면 다시 녹음할 수 있어요
        </p>
      </main>

      <footer className="grid grid-cols-2 gap-[2.74vw]">
        <RetryRecordingButton
          icon="stash:arrow-retry"
          description="다시 녹음"
          handleRecord={retryRecording}
        />
        <RecordButton
          icon="line-md:square-filled"
          description="녹음 완료"
          handleRecord={stopRecording}
          disabled={false}
        />
      </footer>
    </section>
  );
}
