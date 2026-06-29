'use client';

import StepIntroPage from '../_components/StepIntroPage';

export default function RecallIntroPage() {
  return (
    <StepIntroPage
      message={<>이제, 기억의 조각을 <br /> 맞춰보겠습니다.</>}
      nextStep={6}
      imageSrc="/tolli1.webp"
      imageAlt="Tolli"
    />
  );
}
