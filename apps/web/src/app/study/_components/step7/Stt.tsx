import Image from "next/image";
import StandingTolli from "../../../../../public/images/onBoarding/standingTolli_1.svg";
import { Icon } from "@iconify/react";
import SoundBar from "../../../../../public/images/soundBar.svg";

export default function Stt() {
  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-13 px-10.5">
      <header className="flex shrink-0 items-center justify-center mb-9.75">
        <h2 className="font-semibold text-[1.375rem] leading-8 text-[#CCB5F0] text-center">
          말씀을 듣고, 보고 <br /> 준비되면 말해보세요.
        </h2>
      </header>

      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        <div className="flex-1 min-h-0 rounded-[3.125rem] bg-linear-to-tr from-[#917DB0] to-[#7A7A7A] p-0.5 w-full">
          <div className="flex flex-col h-full w-full items-center justify-center gap-4 rounded-[3.125rem] bg-bg p-4">
            <Image
              src={StandingTolli}
              alt="standing tolli"
              className="w-27.5 h-auto drop-shadow-[4px_11px_24px_rgba(255,255,255,0.25)]"
            />
            <Image
              src={SoundBar}
              alt="sound bar"
              className="w-full h-auto"
            />
          </div>
        </div>

        <button className="shrink-0 bg-[#CCB5F0] rounded-[1.25rem] items-center justify-center flex flex-row py-3.25 gap-1.5 mb-6.5">
          <Icon
            icon="fluent:mic-record-28-filled"
            className="text-[#000000] size-6"
          />
          <span className="font-semibold text-[1rem] leading-[1.425rem] text-[#1B1B1B]">
            녹음 시작
          </span>
        </button>
      </main>

      <footer className="grid grid-cols-3 gap-4 shrink-0">
        <button className="flex flex-col items-center justify-center gap-1.25">
          <Icon
            icon="ph:speaker-high-bold"
            className="size-5 text-[#CECECE]"
          />
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
      </footer>
    </section>
  );
}
