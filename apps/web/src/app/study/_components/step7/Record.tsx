"use client";

import DiffHeader from "./_components/header/DiffHeader";
import RecordBarContainer from "./_components/center/RecordBarContainer";
import RecordCircle from "./_components/RecordCircle";
import ActiveSoundBar from "../../../../../public/images/activeSoundBar.svg";
import NotActiveSoundbar from "../../../../../public/images/NotActiveSoundbar.svg";
import RecordButton from "./_components/button/RecordButton";
import { useCallback, useEffect, useState } from "react";
import { Step7Phase } from "./_types";
import { Icon } from "@iconify/react";
import RecordComplete from "./RecordComplete";
import { useRecord } from "./hooks/useRecord";
import { formatTime } from "./_utils/formatTime";
import { getVerse } from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";

export default function Record({ verseId }: { verseId: number }) {
  const [phase, setPhase] = useState<Step7Phase>("idle");
  const [showVerse, setShowVerse] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { elapsed, start, stop, levels } = useRecord();
  const [needSettings, setNeedSettings] = useState(false);
  const [fullText, setFullText] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    getVerse(dataConnect, { id: verseId }).then((result) => {
      const verse = result.data.verse;
      if (!verse) return;
      setFullText(verse.fullText);
      setReference(verse.reference);
    });
  }, [verseId]);

  // start()를 통해 녹음 기능을 시작한다.
  // 그와 더해 관련 상태를 변화시킨다.
  const beginRecording = useCallback(async () => {
    try {
      await start();
      setPhase("recording");
      setDisabled(true);
      setTimeout(() => setDisabled(false), 5000);
    } catch (e: any) {
      if (e?.name === "NotAllowedError") setNeedSettings(true);
      // 나중에 vercel 배포 후에 수정 필요
      setPhase("idle");
    }
  }, [start]);

  // startRecording() 응답 결과가 마이크 권한 허용이면 녹음 로직 시작
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // RN이 보낸 JSON 문자열만 처리 (HMR/DevTools 등 객체 메시지는 무시)
      if (typeof e.data !== "string") return;
      try {
        const { type, status } = JSON.parse(e.data);
        if (type === "RECORD_PERMISSION") {
          if (status === "granted") {
            setNeedSettings(false);
            beginRecording();
          } else if (status === "denied") {
            setNeedSettings(true);
          } else {
            setNeedSettings(true);
          }
          // 거부되면 거부 메시지 안내 처리
        }
      } catch {
        // RN 외 메시지 무시
      }
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage as EventListener);
    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  }, [beginRecording]);

  // 녹음 시작하기 누르면 RN으로 마이크 권한 요청 전송함
  // 단, RN WebView가 아닌 일반 브라우저에서는 브라우저가 직접 권한을 처리하므로 바로 시작한다.
  const startRecording = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "RECORD_READY" }),
      );
    } else {
      beginRecording();
    }
  };

  // 녹음 중단되면 멈춘다.
  const stopRecording = async () => {
    await stop();
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
    return <RecordComplete retryRecording={retryRecording} verseId={verseId} />;
  }

  const openAppSettings = () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "OPEN_APP_SETTINGS" }),
    );
  };

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
            fullText={fullText}
            reference={reference}
          />
        )}
        {phase === "recording" && (
          <RecordBarContainer
            showVerse={showVerse}
            soundBar={ActiveSoundBar}
            recordIcon={RecordCircle}
            description={formatTime(elapsed)}
            levels={levels}
            fullText={fullText}
            reference={reference}
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
                : "border-1 border-white/15 bg-linear-to-br from-white/10 via-white/15 to-white/20"
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
      {needSettings && (
        <div
          onClick={() => setNeedSettings(false)}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#000000]/60"
        >
          <div className="flex items-center justify-center min-h-screen w-full px-[clamp(0.875rem,5vw,1.25rem)]">
            <div className="w-full max-w-90 rounded-[clamp(1rem,6vw,1.5rem)] bg-linear-to-br from-white/30 via-white/15 to-white/20 p-px">
              <div className="flex flex-col items-center justify-center w-full py-[clamp(1rem,6vw,1.5rem)] px-[clamp(1rem,6vw,1.5rem)] bg-bg rounded-[clamp(1rem,6vw,1.5rem)]">
                <p className="font-semibold text-[clamp(1rem,4.75vw,1.1875rem)] leading-[clamp(1.5rem,7.75vw,1.9375rem)] text-[#CCB5F0] mb-[clamp(0.75rem,4.5vw,1.125rem)]">
                  마이크 권한이 꺼져 있어요. 녹음하려면 설정에서 허용해주세요.
                </p>
                <div className="flex flex-col w-full gap-[clamp(0.375rem,2vw,0.5rem)]">
                  <button
                    onClick={openAppSettings}
                    className="
                    w-full rounded-[clamp(0.875rem,5vw,1.25rem)]
                    py-[clamp(0.5rem,3vw,0.75rem)]
                    font-semibold text-bg bg-[#CCB5F0]
                    text-[clamp(0.8125rem,3.75vw,0.9375rem)]
                    leading-[clamp(1.25rem,6.25vw,1.5625rem)]"
                  >
                    설정 열기
                  </button>
                  <button
                    onClick={() => setNeedSettings(false)}
                    className="
                    w-full rounded-[clamp(0.875rem,5vw,1.25rem)]
                    py-[clamp(0.5rem,3vw,0.75rem)]
                    font-semibold text-bg bg-[#D9D9D9]
                    text-[clamp(0.8125rem,3.75vw,0.9375rem)]
                    leading-[clamp(1.25rem,6.25vw,1.5625rem)]"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
