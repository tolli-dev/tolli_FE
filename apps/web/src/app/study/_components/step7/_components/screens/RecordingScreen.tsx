import DiffHeader from "../header/DiffHeader";
import RecordBarContainer from "../center/RecordBarContainer";
import RecordButton from "../RecordButton";
import RecordCircle from "../RecordCircle";
import ActiveSoundBar from "../../../../../../../public/images/activeSoundBar.svg";

export default function RecordingScreen({ onEnd }: { onEnd: () => void }) {
  return (
    <>
      <DiffHeader
        instruction1="기억나는 만큼 말해보세요!"
        instruction2="3어절만 맞아도 완료입니다"
      />
      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        <RecordBarContainer
          soundBar={ActiveSoundBar}
          recordIcon={RecordCircle}
          description="00:12"
        />
        <RecordButton
          recordIcon="fluent:mic-record-28-filled"
          description="녹음 완료"
          handleRecord={onEnd}
        />
      </main>
    </>
  );
}