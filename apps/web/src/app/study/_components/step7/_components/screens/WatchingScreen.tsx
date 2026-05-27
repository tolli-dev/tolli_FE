import DiffHeader from "../header/DiffHeader";
import WatchingVerseContainer from "../center/WatchingVerseContainer";
import RecordButton from "../RecordButton";

export default function WatchingScreen({ onStart }: { onStart: () => void }) {
  return (
    <>
      <DiffHeader
        instruction1="말씀을 잠시 보여드릴게요!"
        instruction2="2초 후 자동 사라집니다"
      />
      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        <WatchingVerseContainer />
        <RecordButton
          recordIcon="fluent:mic-record-28-filled"
          description="녹음 시작"
          handleRecord={onStart}
        />
      </main>
    </>
  );
}