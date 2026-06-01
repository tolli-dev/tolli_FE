"use client";

import DiffHeader from "../header/DiffHeader";
import RecordBarContainer from "../center/RecordBarContainer";
import RecordButton from "../button/RecordButton";
import RecordCircle from "../RecordCircle";
import ActiveSoundBar from "../../../../../../../public/images/activeSoundBar.svg";
import { useEffect, useState } from "react";

type STTResult = { type: "STT_RESULT"; transcript: string; isFinal: boolean };
type STTError = {
  type: "STT_ERROR";
  error: string;
  message: string;
};
type STTMessage = STTResult | STTError;

export default function RecordingScreen() {
  const [result, setResult] = useState<STTMessage>();

  const requestRecord = () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "ANDROID_RECORD" }),
    );
  };

  const requestStopRecord = () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "ANDROID_STOP_RECORD" }),
    );
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const sttData = JSON.parse(e.data);

        if (sttData.type === "STT_RESULT") {
          setResult(sttData);
        }

        if (sttData.type === "STT_ERROR") {
          setResult(sttData);
        }

        if (sttData.type === "STT_END") {
          requestStopRecord();
        }
      } catch (error) {}
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage as EventListener);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  }, []);

  return (
    <>
      <DiffHeader
        instruction1="기억나는 만큼 말해보세요!"
        instruction2="3어절만 맞아도 완료입니다"
      />
      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        {result?.type === "STT_ERROR" && <p>{result.message}</p>}
        {result?.type === "STT_RESULT" && <p>{result.transcript}</p>}
        <RecordBarContainer
          soundBar={ActiveSoundBar}
          recordIcon={RecordCircle}
          description="00:12"
        />
        <RecordButton
          icon="fluent:mic-record-28-filled"
          description="녹음 완료"
          handleRecord={requestRecord}
        />
      </main>
    </>
  );
}
