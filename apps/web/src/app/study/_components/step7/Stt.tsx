"use client";

import { useState } from "react";
import { Step7Phase } from "./_types";
import IdleScreen from "./_components/screens/IdleScreen";
import ListeningScreen from "./_components/screens/ListeningScreen";
import WatchingScreen from "./_components/screens/WatchingScreen";
import RecordingScreen from "./_components/screens/RecordingScreen";
import FooterButton from "./_components/FooterButton";

export default function Stt() {
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
    }
  };

  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-4 px-10.5">
      {renderScreen()}
      <footer className="grid grid-cols-3 gap-4 shrink-0">
        <FooterButton
          handleListeningVerse={() => setPhase("listening")}
          handleWatchingVerse={() => setPhase("watching")}
          handleWritingVerse={() => setPhase("listening")}
        />
      </footer>
    </section>
  );
}