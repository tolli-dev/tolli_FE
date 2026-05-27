"use client";

import SameHeader from "./_components/header/SameHeader";
import DiffHeader from "./_components/header/DiffHeader";
import RecordBarContainer from "./_components/center/RecordBarContainer";
import WatchingVerseContainer from "./_components/center/WatchingVerseContainer";
import RecordButton from "./_components/RecordButton";
import FooterButton from "./_components/FooterButton";
import SoundBar from "../../../../../public/images/soundBar.svg";
import ActiveSoundBar from "../../../../../public/images/activeSoundBar.svg";
import { useState } from "react";

export default function Stt() {
  const [listeningVerse, setListeningVerse] = useState(false);
  const [watchingVerse, setWatchingVerse] = useState(false);
  const [writingVerse, setWritingVerse] = useState(false);

  const handleListeningVerse = () => {
    setListeningVerse(true);
    setWatchingVerse(false);
    setWritingVerse(false);
  };

  const handleWatchingVerse = () => {
    setListeningVerse(false);
    setWatchingVerse(true);
    setWritingVerse(false);
  };

  const handleWritingVerse = () => {
    setListeningVerse(true);
    setWatchingVerse(false);
    setWritingVerse(false);
  };

  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-4 px-10.5">
      {!listeningVerse && !watchingVerse && !writingVerse && (
        <>
          <SameHeader
            instruction1="말씀을 잠시 보여드릴게요!"
            instruction2="2초 후 자동 사라집니다"
          />

          <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
            <RecordBarContainer soundBar={SoundBar} description="" />
            <RecordButton />
          </main>
        </>
      )}

      {listeningVerse && !watchingVerse && !writingVerse && (
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
            <RecordButton />
          </main>
        </>
      )}

      {!listeningVerse && watchingVerse && !writingVerse && (
        <>
          <DiffHeader
            instruction1="말씀을 들려드릴게요"
            instruction2="준비 되셨나요?"
          />
          <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
            <WatchingVerseContainer />
            <RecordButton />
          </main>
        </>
      )}

      <footer className="grid grid-cols-3 gap-4 shrink-0">
        <FooterButton
          handleListeningVerse={handleListeningVerse}
          handleWatchingVerse={handleWatchingVerse}
          handleWritingVerse={handleWritingVerse}
        />
      </footer>
    </section>
  );
}
