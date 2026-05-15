'use client';

import { usePathname } from 'next/navigation';

const TOTAL_STEPS = 3;

export default function StepIndicator() {
  const pathname = usePathname();
  const currentStep = Number(pathname.split('/').pop());

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all duration-300 ${
            i + 1 === currentStep
              ? 'w-5 h-2 bg-primary-200'
              : 'w-2 h-2 bg-surface-400'
          }`}
        />
      ))}
    </div>
  );
}
