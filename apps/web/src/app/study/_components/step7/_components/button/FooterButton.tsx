import { Icon } from "@iconify/react";
import { Step7Phase } from "../../_types";

interface Props {
  phase: Step7Phase;
  handleListeningVerse: () => void;
  handleWatchingVerse: () => void;
  handleRecordingVerse: () => void;
}

export default function FooterButton({
  phase,
  handleListeningVerse,
  handleWatchingVerse,
  handleRecordingVerse,
}: Props) {
  const listeningColorClass =
    phase === "listening" ? "text-[#CCB5F0]" : "text-[#CECECE]";

  const watchingColorClass =
    phase === "watching" ? "text-[#CCB5F0]" : "text-[#CECECE]";

  return (
    <>
      <button
        onClick={handleListeningVerse}
        className="flex flex-col items-center justify-center gap-1.25"
      >
        <Icon
          icon="ph:speaker-high-bold"
          className={`size-5 ${listeningColorClass}`}
        />
        <span
          className={`font-normal text-[0.75rem] leading-[1.425rem] ${listeningColorClass}`}
        >
          말씀 듣기
        </span>
      </button>
      <button
        onClick={handleWatchingVerse}
        className="flex flex-col items-center justify-center gap-1.25"
      >
        <Icon icon="mi:book" className={`size-5 ${watchingColorClass}`} />
        <span
          className={`font-normal text-[0.75rem] leading-[1.425rem] ${watchingColorClass}`}
        >
          구절 잠깐 보기
        </span>
      </button>
    </>
  );
}
