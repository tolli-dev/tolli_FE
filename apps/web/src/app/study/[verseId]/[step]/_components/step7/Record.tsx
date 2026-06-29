'use client';

import DiffHeader from './_components/header/DiffHeader';
import RecordBarContainer from './_components/center/RecordBarContainer';
import RecordCircle from './_components/RecordCircle';
import ActiveSoundBar from '../../../../../../../public/images/activeSoundBar.svg';
import NotActiveSoundbar from '../../../../../../../public/images/NotActiveSoundbar.svg';
import RecordButton from './_components/button/RecordButton';
import { useState } from 'react';
import { Step7Phase } from './_types';
import { Icon } from '@iconify/react';
import RecordComplete from './RecordComplete';
import { useRecord } from './hooks/useRecord';
import { useRNRecordPermission } from './hooks/useRNRecordPermission';
import { formatTime } from './_utils/formatTime';
import { playSound } from '@/lib/sound';
import posthog from 'posthog-js';

interface RecordProps {
  verseId: number;
  fullText: string;
  reference: string;
}

export default function Record({ verseId, fullText, reference }: RecordProps) {
  const [phase, setPhase] = useState<Step7Phase>('idle');
  const [showVerse, setShowVerse] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { elapsed, start, stop, levels } = useRecord();

  const { needSettings, requestPermission, openAppSettings, triggerNeedSettings, clearNeedSettings } =
    useRNRecordPermission(beginRecording);

  // start()를 통해 녹음 기능을 시작한다.
  // 그와 더해 관련 상태를 변화시킨다.
  function beginRecording() {
    start()
      .then(() => {
        setPhase('recording');
        setDisabled(true);
        setTimeout(() => setDisabled(false), 5000);
      })
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === 'NotAllowedError') triggerNeedSettings();
        // 나중에 vercel 배포 후에 수정 필요
        setPhase('idle');
      });
  }

  const startRecording = () => {
    posthog.capture('recording_started', { verse_id: verseId });
    requestPermission();
  };

  const stopRecording = async () => {
    await stop();
    posthog.capture('recording_completed', { verse_id: verseId, duration_sec: elapsed });
    setPhase('complete');
  };

  const handleViewVerse = () => {
    playSound('/sounds/말씀 잠깐 보기 힌트일때 카드 공개_비공개 후보.mp3');
    setShowVerse(true);
    setTimeout(() => {
      setShowVerse(false);
    }, 2000);
    return;
  };

  function retryRecording() {
    setPhase('idle');
  }

  if (phase === 'complete') {
    return <RecordComplete retryRecording={retryRecording} verseId={verseId} />;
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
        {phase === 'idle' && (
          <RecordBarContainer
            showVerse={showVerse}
            soundBar={NotActiveSoundbar}
            fullText={fullText}
            reference={reference}
          />
        )}
        {phase === 'recording' && (
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
                ? 'bg-[#B09ECC]'
                : 'border border-white/15 bg-linear-to-br from-white/10 via-white/15 to-white/20'
            }`}
          >
            <div className="flex flex-col items-center justify-center w-full px-[4.23vw] py-[1.74vw] bg-[#787878]/20 rounded-[4.60vw]">
              <Icon
                icon="famicons:eye"
                className={`${showVerse ? 'text-[#1B1B1B]' : 'text-[#FFFFFF]'} w-[5.72vw] h-auto`}
              />
            </div>
          </div>
          <span className="font-regular text-[2.99vw] leading-[5.67vw] text-[#CECECE] whitespace-nowrap">
            구절 잠깐 보기
          </span>
        </button>
      </main>

      <footer className="flex justify-center w-full min-h-12">
        {phase === 'idle' && (
          <RecordButton
            icon="fluent:mic-record-28-filled"
            description="녹음 시작"
            handleRecord={startRecording}
          />
        )}
        {phase === 'recording' && (
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
          onClick={clearNeedSettings}
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
                    onClick={clearNeedSettings}
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
