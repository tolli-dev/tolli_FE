import { ReactNode } from 'react';

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
  imageSize: string;
  extra?: ReactNode;
}

export default function OnboardingSlide({
  title,
  description,
  image,
  imageSize,
  extra,
}: OnboardingSlideProps) {
  return (
    <div className="flex flex-col flex-1 items-start px-6">
      <h1 className="text-h1 text-primary-50 whitespace-pre-line">{title}</h1>
      <p className="mt-3 text-h2 text-surface-200 whitespace-pre-line">{description}</p>
      <div className=" flex-1" />
      <div className="flex flex-col w-full justify-center items-center">
        {extra && <div className="w-full">{extra}</div>}
        <img src={image} alt="" style={{ width: imageSize }} className="object-contain" />
      </div>
      <div className="flex-1" />
    </div>
  );
}
