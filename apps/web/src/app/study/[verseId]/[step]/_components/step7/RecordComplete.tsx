import CompleteContainer from "./_components/center/CompleteContainer";
import DiffHeader from "./_components/header/DiffHeader";
import RecordButton from "./_components/button/RecordButton";
import { useRouter } from "next/navigation";
import RetryRecordingButton from "./_components/button/RetryRecordingButton";
import Bookmark from "../../../_components/Bookmark";
import { useStudyComplete } from "../../../_hooks/useStudyComplete";

const LAST_VERSE_ID_WITH_BGM = 30;

export default function RecordComplete({
  retryRecording,
  verseId,
}: {
  retryRecording: () => void;
  verseId: number;
}) {
  const router = useRouter();
  const hasBgm = verseId <= LAST_VERSE_ID_WITH_BGM;
  const { submitError, bookmarkModal, handleComplete, clearError } =
    useStudyComplete(verseId);

  const stopRecording = () => {
    if (hasBgm) {
      router.push(`/study/${verseId}/listen`);
      return;
    }
    handleComplete();
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

      {!hasBgm && bookmarkModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#000000]/60">
          <Bookmark verseId={verseId} />
        </div>
      )}

      {!hasBgm && submitError && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-60 bg-[#000000]/60 px-[clamp(1.5rem,8vw,2.5rem)]">
          <div className="bg-white w-full rounded-[clamp(1.5rem,8vw,2rem)] p-[clamp(1.5rem,8vw,2rem)] flex flex-col items-center gap-[clamp(1rem,5vw,1.5rem)] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col items-center gap-[clamp(0.5rem,2vw,0.75rem)]">
              <h3 className="text-[#1B1B1B] font-bold text-[clamp(1.125rem,5vw,1.25rem)] text-center whitespace-nowrap">
                학습 완료에 실패했어요
              </h3>
              <p className="text-[#383838] text-[clamp(0.875rem,4vw,1rem)] text-center whitespace-nowrap leading-relaxed">
                학습 데이터를 저장하는 중 문제가 발생했습니다.
                <br />
                잠시 후 다시 시도해주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="w-full bg-[#CCB5F0] text-[#1B1B1B] font-bold py-[clamp(0.875rem,4.5vw,1.125rem)] rounded-[clamp(1rem,5vw,1.25rem)] text-[clamp(0.875rem,4vw,1rem)] mt-[clamp(0.5rem,2vw,1rem)] whitespace-nowrap"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
