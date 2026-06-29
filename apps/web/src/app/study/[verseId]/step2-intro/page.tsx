'use client';

import StepIntroPage from '../_components/StepIntroPage';

export default function Step2IntroPage() {
  return (
    <StepIntroPage
      message={<>굿! <br /> 이제 빈칸을 맞춰주세요</>}
      nextStep={2}
      imageSrc="/tolli1.webp"
      imageAlt="Tolli"
    />
  );
}
