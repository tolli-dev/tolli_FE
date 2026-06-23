'use client';

import StepIntroPage from '../_components/StepIntroPage';

export default function RecordIntroPage() {
  return (
    <StepIntroPage
      message={<>마지막 단계!<br /> 이제 직접 입으로 말씀을<br /> 외쳐보세요!</>}
      nextStep={7}
      imageSrc="/TolliLastStep.webp"
      imageAlt="tolli"
      layout="bottom-image"
      imageStyle={{ animation: 'slide-up 0.4s ease forwards' }}
    />
  );
}
