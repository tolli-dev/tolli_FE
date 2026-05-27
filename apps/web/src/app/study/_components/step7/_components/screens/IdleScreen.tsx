import SameHeader from "../header/SameHeader";
import RecordBarContainer from "../center/RecordBarContainer";
import RecordButton from "../RecordButton";
import SoundBar from "../../../../../../../public/images/soundBar.svg";

export default function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <>
      <SameHeader
        instruction1="말씀을 듣고, 보고"
        instruction2="준비되면 말해보세요"
      />
      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        <RecordBarContainer soundBar={SoundBar} description="" />
        <RecordButton
          recordIcon="fluent:mic-record-28-filled"
          description="녹음 시작"
          handleRecord={onStart}
        />
      </main>
    </>
  );
}