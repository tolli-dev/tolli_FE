import SameHeader from "../header/SameHeader";
import RecordBarContainer from "../center/RecordBarContainer";
import RecordButton from "../button/RecordButton";
import ActiveSoundBar from "../../../../../../../public/images/activeSoundBar.svg";

export default function ListeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <>
      <SameHeader
        instruction1="말씀을 들려드릴게요"
        instruction2="준비 되셨나요?"
      />
      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        <RecordBarContainer
          soundBar={ActiveSoundBar}
          description="정확히 외우지 못해도 괜찮아요"
        />
        <RecordButton
          icon="fluent:mic-record-28-filled"
          description="녹음 시작"
          handleRecord={onStart}
        />
      </main>
    </>
  );
}
