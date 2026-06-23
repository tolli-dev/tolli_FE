'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import { useDeviceCornerRadius } from '@/hooks/useDeviceCornerRadius';

interface StepIntroPageProps {
  message: React.ReactNode;
  nextStep: number;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
  layout?: 'centered' | 'bottom-image';
}

const BORDER_SPIN_STYLE = `
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes border-spin {
    from { --angle: 0deg; }
    to { --angle: 360deg; }
  }
`;

export default function StepIntroPage({
  message,
  nextStep,
  imageSrc,
  imageAlt,
  imageClassName,
  imageStyle,
  layout = 'centered',
}: StepIntroPageProps) {
  const router = useRouter();
  const { verseId } = useParams<{ verseId: string }>();
  const cornerRadius = useDeviceCornerRadius();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/study/${verseId}/${nextStep}`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router, verseId, nextStep]);

  const spinningBorder = (
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
  );

  if (layout === 'bottom-image') {
    return (
      <div className="fixed inset-0 flex flex-col overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, #CCB5F0 0%, #FFFFFF 100%)' }}
        />
        {spinningBorder}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[1.5rem] leading-8.5 font-semibold text-[#1B1B1B] text-center">
            {message}
          </p>
        </div>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1080}
          height={1080}
          className={imageClassName ?? 'relative -z-10 w-full h-auto'}
          priority
          style={imageStyle}
        />
        <style>{BORDER_SPIN_STYLE}</style>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-1 h-full items-center justify-center gap-11.25">
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, #CCB5F0 0%, #FFFFFF 100%)' }}
      />
      {spinningBorder}
      <p className="text-[1.5rem] leading-8.5 font-medium text-[#1A1A1A] text-center">
        {message}
      </p>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={228}
        height={228}
        className={imageClassName ?? 'object-contain'}
        priority
        style={imageStyle}
      />
      <style>{BORDER_SPIN_STYLE}</style>
    </div>
  );
}
