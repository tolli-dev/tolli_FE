import ShowVerseContainer from "./ShowVerseContainer";
import ShowPhaseContainer from "./ShowIdleContainer";

export default function RecordBarContainer({
  showVerse,
  description,
  recordIcon: RecordIcon,
  soundBar,
  levels,
}: {
  showVerse: boolean;
  description?: string;
  recordIcon?: () => JSX.Element;
  soundBar: string;
  levels?: number[];
}) {
  return (
    <>
      <div className="flex flex-col h-full w-full items-center rounded-[3.125rem] bg-linear-to-tr from-[#917DB0] to-[#7A7A7A] p-0.5">
        <div className="flex flex-1 flex-col w-full items-center rounded-[3.125rem] bg-bg p-4">
          {showVerse && <ShowVerseContainer />}
          {!showVerse && (
            <ShowPhaseContainer
              description={description}
              recordIcon={RecordIcon}
              soundBar={soundBar}
              levels={levels}
            />
          )}
        </div>
      </div>
    </>
  );
}
