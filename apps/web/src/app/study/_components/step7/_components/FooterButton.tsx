import { Icon } from "@iconify/react";

export default function FooterButton() {
  return (
    <>
      <button className="flex flex-col items-center justify-center gap-1.25">
        <Icon icon="ph:speaker-high-bold" className="size-5 text-[#CECECE]" />
        <span className="font-normal text-[0.75rem] leading-[1.425rem] text-[#CECECE]">
          말씀 듣기
        </span>
      </button>
      <button className="flex flex-col items-center justify-center gap-1.25">
        <Icon icon="mi:book" className="size-5 text-[#CECECE]" />
        <span className="font-normal text-[0.75rem] leading-[1.425rem] text-[#CECECE]">
          구절 잠깐 보기
        </span>
      </button>
      <button className="flex flex-col items-center justify-center gap-1.25">
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
