import type { ReactElement } from "react";
import ShowVerseContainer from "./ShowVerseContainer";
import ShowPhaseContainer from "./ShowIdleContainer";

export default function RecordBarContainer({
  showVerse,
  description,
  recordIcon: RecordIcon,
  soundBar,
  levels,
  fullText,
  reference,
}: {
  showVerse: boolean;
  description?: string;
  recordIcon?: () => ReactElement;
  soundBar: string;
  levels?: number[];
  fullText?: string;
  reference?: string;
}) {
  return (
    <>
      <div className="card-flip-scene flex flex-col h-full w-full items-center rounded-[3.125rem] bg-linear-to-tr from-[#917DB0] to-[#7A7A7A] p-0.5">
        <div className={`card-flip-inner flex flex-1 flex-col w-full rounded-[3.125rem]${showVerse ? ' flipped' : ''}`}>
          <div className="card-flip-front flex flex-1 flex-col w-full items-center rounded-[3.125rem] bg-bg p-4">
            <ShowPhaseContainer
              description={description}
              recordIcon={RecordIcon}
              soundBar={soundBar}
              levels={levels}
            />
          </div>
          <div className="card-flip-back flex flex-1 flex-col w-full items-center rounded-[3.125rem] bg-bg p-4">
            <ShowVerseContainer fullText={fullText ?? ''} reference={reference ?? ''} />
          </div>
        </div>
      </div>
    </>
  );
}
