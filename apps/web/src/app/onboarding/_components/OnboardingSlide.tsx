import Image from "next/image";

interface Props {
  current: {
    title: string;
    description: string;
    image: string;
    imageSize: string;
    extra?: React.ComponentType;
  };
}

export default function OnboardingSlide({ current }: Props) {
  const { title, description, extra: Extra, imageSize, image } = current;

  return (
    <div className="flex flex-col flex-1 items-start">
      <h1 className="text-h1 text-primary-50 whitespace-pre-line">{title}</h1>
      <p className="mt-3 text-h2 text-surface-200 whitespace-pre-line">
        {description}
      </p>
      <div className="flex flex-col flex-1 w-full justify-center items-center">
        {Extra && (
          <div className="w-full">
            <Extra />
          </div>
        )}
        <div
          className="relative"
          style={{ width: imageSize, height: imageSize }}
        >
          <Image
            src={image}
            alt="온보딩 이미지"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
