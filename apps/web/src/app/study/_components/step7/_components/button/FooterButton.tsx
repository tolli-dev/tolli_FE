import { Icon } from "@iconify/react";

interface Props {
  handleListeningVerse: () => void;
  handleWatchingVerse: () => void;
  handleWritingVerse: () => void;
}

export default function FooterButton({
  handleListeningVerse,
  handleWatchingVerse,
  handleWritingVerse,
}: Props) {
  return (
    <>
      <button
        onClick={handleListeningVerse}
        className="flex flex-col items-center justify-center gap-1.25"
      >
        <Icon icon="ph:speaker-high-bold" className="size-5 text-[#CECECE]" />
        <span className="font-normal text-[0.75rem] leading-[1.425rem] text-[#CECECE]">
          말씀 듣기
        </span>
      </button>
      <button
        onClick={handleWatchingVerse}
        className="flex flex-col items-center justify-center gap-1.25"
      >
        <Icon icon="mi:book" className="size-5 text-[#CECECE]" />
        <span className="font-normal text-[0.75rem] leading-[1.425rem] text-[#CECECE]">
          구절 잠깐 보기
        </span>
      </button>
      <button
        onClick={handleWritingVerse}
        className="flex flex-col items-center justify-center gap-1.2
      "
      >
        <Icon
          icon="material-symbols:keyboard-outline-rounded"
          className="size-5 text-[#CECECE]"
        />
        <span className="font-normal text-[0.75rem] leading-[1.425rem] text-[#CECECE]">
          글로 적기
        </span>
      </button>
    </>
  );
}
