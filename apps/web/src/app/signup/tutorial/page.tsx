'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const STEPS = [
  {
    stepNum: 1,
    title: '양식을 만나요',
    subtitle: '말씀, 하루의 일용할 양식',
    caption: '배고픈 tolli가 기다리고 있어요!',
    image: '/images/onBoarding/hungryTolli_1.webp',
  },
  {
    stepNum: 2,
    title: '양식을 채워요',
    subtitle: '말씀을 외울수록 tolli의 배가 불러요',
    caption: '한 구절씩, tolli의 배를 채워줘요',
    image: '/images/onBoarding/eatingTolli.webp',
  },
  {
    stepNum: 3,
    title: '양식이 새겨져요',
    subtitle: 'tolli를 먹일수록',
    caption: '일상 속에서 말씀이 나를 먹여요',
    image: '/images/onBoarding/fullTolli.webp',
  },
];

const TOTAL = STEPS.length;
type Phase = 'idle' | 'exit' | 'enter';

export default function AfterLoginOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const nextRef = useRef<number | 'done' | null>(null);

  const current = STEPS[step];
  const isLast = step === TOTAL - 1;

  useEffect(() => {
    STEPS.forEach((s) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = s.image;
      document.head.appendChild(link);
    });
    router.prefetch('/signup/set-nickname');
  }, [router]);

  const navigate = (dest: number | 'done') => {
    if (phase !== 'idle') return;
    nextRef.current = dest;
    setPhase('exit');
  };

  const handleAnimationEnd = () => {
    if (phase === 'exit') {
      const dest = nextRef.current;
      if (dest === 'done') {
        router.push('/signup/set-nickname');
        return;
      }
      if (dest !== null) setStep(dest as number);
      nextRef.current = null;
      setPhase('enter');
    } else if (phase === 'enter') {
      setPhase('idle');
    }
  };

  const slideClass =
    phase === 'exit'
      ? 'onboarding-slide-exit'
      : phase === 'enter'
        ? 'onboarding-slide-enter'
        : '';

  return (
    <section className="flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)] overflow-hidden">
      {/* Step indicator */}
      <div className="flex flex-row justify-center items-center gap-[1.125rem] mt-[clamp(1.5rem,5dvh,3rem)]">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            style={{
              width: '0.438rem',
              height: '0.438rem',
              borderRadius: '9999px',
              backgroundColor:
                i === step
                  ? 'var(--color-primary-50)'
                  : 'var(--color-surface-100)',
              transform: i === step ? 'scale(1.3)' : 'scale(1)',
              WebkitTransition: 'background-color 0.3s ease, -webkit-transform 0.3s ease',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Slide area */}
      <div
        className={`flex flex-col items-center flex-1 w-full mt-[clamp(1.5rem,6dvh,3.813rem)] mb-[clamp(1.5rem,3dvh,6.063rem)] ${slideClass}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="relative w-[1.938rem] h-[1.938rem] rounded-full bg-surface-100 mb-[0.438rem]">
          <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-bg text-h1 leading-none ml-[-1px]">
            {current.stepNum}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-[0.125rem] mb-[clamp(1.5rem,5dvh,3.813rem)] mt-[0.438rem]">
          <h1 className="text-h1 text-primary-50 whitespace-nowrap">{current.title}</h1>
          <h2 className="text-h2 text-surface-200 whitespace-nowrap">{current.subtitle}</h2>
        </div>

        <div className="relative w-full max-w-[16.125rem] aspect-square">
          <Image src={current.image} fill alt="" className="object-contain" priority />
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col items-center w-full">
        <p className="text-b2 text-surface-300 mb-[0.938rem] whitespace-nowrap">{current.caption}</p>
        <button
          type="button"
          onClick={() => navigate(isLast ? 'done' : step + 1)}
          className="w-full max-w-[19.688rem] h-[3rem] text-btn-lg text-primary-75 bg-surface-500 rounded-[1.25rem]"
        >
          다음
        </button>
      </div>
    </section>
  );
}
