'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { getMyCurrentVerse } from '@firebasegen/default-connector';
import { dataConnect } from '@/lib/dataconnect';
import { getLocalMidnight } from '@/lib/date';
import { useRouter } from 'next/navigation';
import { useDeviceCornerRadius } from '@/hooks/useDeviceCornerRadius';
import { QueryFetchPolicy } from 'firebase/data-connect';
import posthog from 'posthog-js';
import { useExperimentVariant } from '@/hooks/useExperimentVariant';
import { EXPERIMENT_KEY, getEntryStep } from '@/lib/experiment';

async function getTodayVerseId(): Promise<number> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = getLocalMidnight(tz);

  const result = await getMyCurrentVerse(
    dataConnect,
    { today: today.toISOString() },
    {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    },
  );
  const { lastCompletion } = result.data;

  if (lastCompletion.length > 0) return (lastCompletion[0].verse.id % 63) + 1;
  return 1;
}

export default function StudyLoadingPage() {
  const router = useRouter();
  const cornerRadius = useDeviceCornerRadius();
  const variantState = useExperimentVariant();

  useEffect(() => {
    // 그룹이 확정되기 전에 보내면 유저를 잘못된 스텝으로 떨어뜨리게 된다.
    // 스플래시는 어차피 최소 1.5초 머무르므로 그동안 기다린다.
    if (variantState.status !== 'ready') return;

    const { variant } = variantState;
    const entryStep = getEntryStep(variant);

    Promise.all([
      getTodayVerseId(),
      new Promise<void>((resolve) => setTimeout(resolve, 1500)),
    ]).then(([verseId]) => {
      // 실험의 분모. 이 이벤트가 각 그룹이 학습 플로우에 실제로 진입한 횟수이고,
      // 이후 이탈률, 완주율의 기준이 된다.
      posthog.capture('experiment_exposed', {
        experiment: EXPERIMENT_KEY,
        variant,
        entry_step: entryStep,
        verse_id: verseId,
      });
      router.push(`/study/${verseId}/${entryStep}`);
    });
  }, [router, variantState]);

  return (
    <div className="relative flex flex-col flex-1 h-full items-center justify-center gap-11.25">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          borderRadius: `${Math.round(cornerRadius * 0.95)}px`,
          padding: '5px',
          background:
            'conic-gradient(from var(--angle), #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'border-spin 6s linear infinite',
        }}
      />
      <p className="text-[clamp(1.125rem,5.5vw,1.5rem)] leading-[clamp(2rem,8.5vw,2.125rem)] font-medium text-[#CCB5F0] text-center">
        두근두근 <br /> 오늘의 말씀은?
      </p>
      <Image
        src="/tolli1.webp"
        alt="Tolli"
        width={228}
        height={228}
        className="object-contain"
        priority
      />
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
      `}</style>
    </div>
  );
}
