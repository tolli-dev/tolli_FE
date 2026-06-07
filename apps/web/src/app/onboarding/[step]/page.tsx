'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import OnboardingSlide from '@/app/onboarding/_components/OnboardingSlide';
import OnboardingActions from '@/app/onboarding/_components/OnboardingActions';
import LearningSteps from '@/app/onboarding/_components/LearningSteps';

const STEPS = [
  {
    title: '말씀이 필요한 순간\n떠오르도록',
    description: '읽고 지나가는 것이 아니라\n마음에 남아 입으로 나오게 합니다.',
    image: '/tolli1.webp',
    imageSize: '16.375rem',
  },
  {
    title: '보는 것에서 기억으로',
    description: '한 구절을 따라가다 보면,\n어느 순간 입으로 말하게 됩니다.',
    image: '/tolli2.webp',
    imageSize: '19.625rem',
    extra: <LearningSteps />,
  },
  {
    title: '매일 5분, 한 구절이면\n충분합니다',
    description: '그 말씀이 오늘의 생각이 되고\n오늘의 말이 됩니다\n매일, 일용할 양식을 드릴게요.',
    image: '/tolli3.webp',
    imageSize: '19.375rem',
  },
];

const TOTAL_STEPS = STEPS.length;

export default function OnboardingStepPage() {
  const router = useRouter();
  const params = useParams();
  const step = Number(params.step);

  const current = STEPS[step - 1];
  const next = STEPS[step]; // undefined on last step
  const isLastStep = step === TOTAL_STEPS;

  useEffect(() => {
    if (!next) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = next.image;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [next]);

  const notifyOnboardingComplete = () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'ONBOARDING_COMPLETE' })
    );
  };

  const handleNext = () => {
    if (isLastStep) {
      notifyOnboardingComplete();
      router.push('/login');
    } else {
      router.push(`/onboarding/${step + 1}`);
    }
  };

  const handleSkip = () => {
    notifyOnboardingComplete();
    router.push('/login');
  };

  if (!current) {
    router.replace('/onboarding/1');
    return null;
  }

  return (
    <>
      <OnboardingSlide
        title={current.title}
        description={current.description}
        image={current.image}
        imageSize={current.imageSize}
        extra={current.extra}
        priority
      />
      <OnboardingActions isLastStep={isLastStep} onNext={handleNext} onSkip={handleSkip} />
    </>
  );
}
