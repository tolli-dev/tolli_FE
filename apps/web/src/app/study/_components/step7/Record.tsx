"use client";

import DiffHeader from "./_components/header/DiffHeader";
import RecordBarContainer from "./_components/center/RecordBarContainer";
import RecordCircle from "./_components/RecordCircle";
import ActiveSoundBar from "../../../../../public/images/activeSoundBar.svg";
import NotActiveSoundbar from "../../../../../public/images/NotActiveSoundbar.svg";
import RecordButton from "./_components/button/RecordButton";
import { useState } from "react";
import { Step7Phase } from "./_types";
import { Icon } from "@iconify/react";

export default function Record() {
  const [phase, setPhase] = useState<Step7Phase>("idle");
  const [showVerse, setShowVerse] = useState(false);

  const handleViewVerse = () => {
    setShowVerse(true);
    setTimeout(() => {
      setShowVerse(false);
    }, 2000);
    return;
  };

  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-4 px-10.5">
      <header>
        <DiffHeader
          instruction1="직접 소리 내어 말해보세요"
          instruction2="구절 잠깐 보기 힌트가 있어요"
        />
      </header>

      <main className="flex flex-col flex-1 h-[430px] justify-center gap-[57px] w-full mb-[15px]">
        {phase === "idle" && (
          <RecordBarContainer
            showVerse={showVerse}
            soundBar={NotActiveSoundbar}
          />
        )}
        {phase === "recording" && (
          <RecordBarContainer
            showVerse={showVerse}
            soundBar={ActiveSoundBar}
            recordIcon={RecordCircle}
            description="00:12"
          />
        )}

        <button
          onClick={handleViewVerse}
          className="flex flex-col w-[72.19px] h-[68px] items-center justify-center gap-[8px]"
        >
          <div className="w-[57px] h-[37px] rounded-[18.5px] border-1 border-white/15 bg-linear-to-br from-white/10 via-white/15 to-white/20">
            <div className="flex flex-col items-center justify-center w-full px-[17px] py-[7px] bg-[#787878]/20rounded-[18.5px]">
              <Icon
                icon="famicons:eye"
                className="text-[#FFFFFF] w-[23px] h-auto"
              />
            </div>
          </div>
          <span className="font-regular text-[12px] leading-[22.8px] text-[#CECECE]">
            구절 잠깐 보기
          </span>
        </button>
      </main>

      <footer className="flex justify-center w-full min-h-[48px]">
        {(phase === "idle" || phase === "watching") && (
          <RecordButton
            icon="fluent:mic-record-28-filled"
            description="녹음 시작"
            handleRecord={() => setPhase("recording")}
          />
        )}
        {phase === "recording" && (
          <RecordButton
            icon="line-md:square-filled"
            description="녹음 완료"
            handleRecord={() => setPhase("idle")}
          />
        )}
      </footer>
    </section>
  );
}
