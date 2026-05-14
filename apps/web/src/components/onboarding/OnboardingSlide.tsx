interface OnboardingSlideProps {
  title: string;
  description: string;
}

export default function OnboardingSlide({ title, description }: OnboardingSlideProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 gap-4">
      <div className="w-full aspect-square bg-surface-400 rounded-2xl" />
      <h1 className="text-h1 text-center">{title}</h1>
      <p className="text-h2 text-surface-300 text-center">{description}</p>
    </div>
  );
}
