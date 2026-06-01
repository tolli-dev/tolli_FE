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
import RecordComplete from "./RecordComplete";

export default function Record() {
  const [phase, setPhase] = useState<Step7Phase>("idle");
  const [showVerse, setShowVerse] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const startRecording = () => {
    setPhase("recording");
    setDisabled(true);
    setTimeout(() => setDisabled(false), 5000);
  };

  const stopRecording = () => {
    setPhase("complete");
  };

  const handleViewVerse = () => {
    setShowVerse(true);
    setTimeout(() => {
      setShowVerse(false);
    }, 2000);
    return;
  };

  function retryRecording() {
    setPhase("idle");
  }

  if (phase === "complete") {
    return <RecordComplete retryRecording={retryRecording} />;
  }

  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-4 px-10.5">
      <header>
        <DiffHeader
          instruction1="좋아요, 말씀을 소리 내어 말했어요"
          instruction2="잘했어요! 한 걸음 더 성장했어요"
        />
      </header>

      <main className="flex flex-col flex-1 justify-center gap-[14.18vw] w-full mb-[3.73vw]">
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
          className="flex flex-col w-[17.96vw] h-[16.92vw] items-center justify-center gap-[1.99vw]"
        >
          <div
            className={`w-[14.18vw] h-[9.20vw] rounded-[4.60vw] ${
              showVerse
                ? "bg-[#B09ECC]"
                : " border-1 border-white/15 bg-linear-to-br from-white/10 via-white/15 to-white/20"
            }`}
          >
            <div className="flex flex-col items-center justify-center w-full px-[4.23vw] py-[1.74vw] bg-[#787878]/20 rounded-[4.60vw]">
              <Icon
                icon="famicons:eye"
                className={`${showVerse ? "text-[#1B1B1B]" : "text-[#FFFFFF]"} w-[5.72vw] h-auto`}
              />
            </div>
          </div>
          <span className="font-regular text-[2.99vw] leading-[5.67vw] text-[#CECECE]">
            구절 잠깐 보기
          </span>
        </button>
      </main>

      <footer className="flex justify-center w-full min-h-[48px]">
        {phase === "idle" && (
          <RecordButton
            icon="fluent:mic-record-28-filled"
            description="녹음 시작"
            handleRecord={startRecording}
          />
        )}
        {phase === "recording" && (
          <RecordButton
            icon="line-md:square-filled"
            description="녹음 완료"
            handleRecord={stopRecording}
            disabled={disabled}
          />
        )}
      </footer>
    </section>
  );
}
