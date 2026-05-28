"use client";

import { useState } from "react";
import { Step7Phase } from "./_types";
import IdleScreen from "./_components/screens/IdleScreen";
import ListeningScreen from "./_components/screens/ListeningScreen";
import WatchingScreen from "./_components/screens/WatchingScreen";
import RecordingScreen from "./_components/screens/RecordingScreen";
import FooterButton from "./_components/button/FooterButton";
import WritingScreen from "./_components/screens/WritingScreen";
import { useRouter } from "next/navigation";

export default function Stt() {
  const router = useRouter();

  const [phase, setPhase] = useState<Step7Phase>("idle");

  const renderScreen = () => {
    switch (phase) {
      case "idle":
        return <IdleScreen onStart={() => setPhase("recording")} />;
      case "listening":
        return <ListeningScreen onStart={() => setPhase("recording")} />;
      case "watching":
        return <WatchingScreen onStart={() => setPhase("recording")} />;
      case "recording":
        return <RecordingScreen onEnd={() => setPhase("idle")} />;
      case "writing":
        return <WritingScreen onEnd={() => router.push("/study/complete")} />;
    }
  };

  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-4 px-10.5">
      {renderScreen()}
      <footer className="grid grid-cols-3 gap-4 shrink-0">
        <FooterButton
          phase={phase}
          handleListeningVerse={() => setPhase("listening")}
          handleWatchingVerse={() => setPhase("watching")}
          handleWritingVerse={() => setPhase("writing")}
          handleRecordingVerse={() => setPhase("recording")}
        />
      </footer>
    </section>
  );
}
