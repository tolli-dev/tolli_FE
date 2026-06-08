'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';

function CheckIcon({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10.5" cy="10.5" r="10" fill="#CCB5F0" stroke="#928C9C" />
        <path d="M9.19632 15L5 11.2079L6.04908 10.2599L9.19632 13.1039L15.9509 7L17 7.94803L9.19632 15Z" fill="#1B1B1B" />
      </svg>
    );
  }
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="10" stroke="#928C9C" />
    </svg>
  );
}

const TERMS = [
  { id: 'service', label: '(필수) 이용약관 동의', required: true },
  { id: 'privacy', label: '(필수) 개인정보 처리방침 동의', required: true },
  { id: 'marketing', label: '(선택) tolli 새소식 이메일 수신 동의', required: false },
];

export default function TermsPage() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    service: false,
    privacy: false,
    marketing: false,
  });

  const allChecked = TERMS.every(({ id }) => checked[id]);
  const requiredChecked = TERMS.filter(({ required }) => required).every(({ id }) => checked[id]);

  const toggleAll = () => {
    const next = !allChecked;
    setChecked({ service: next, privacy: next, marketing: next });
  };

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    const agreedAt = new Date().toISOString();
    sessionStorage.setItem('termsAgreedAt', agreedAt);
    sessionStorage.setItem('privacyAgreedAt', agreedAt);
    sessionStorage.setItem('emailMarketingAgreed', String(checked.marketing));
    sessionStorage.setItem('emailMarketingAgreedAt', checked.marketing ? agreedAt : '');
    router.push('/welcome');
  };

  return (
    <div className="flex flex-col flex-1 h-full px-13.25 ">
      <div className="pt-20 ">
        <h1 className="text-[24px] leading-8.75 tracking-[-0.07em] font-semibold">환영합니다!</h1>
        <h1 className="text-[24px] leading-8.75 tracking-[-0.07em] font-semibold">
          tolli와 함께 해볼까요?
        </h1>
      </div>

      <div className="flex-1" />
      <div className="flex justify-center">
        <Image src="/tolli-terms.webp" alt="tolli" width={700} height={700} className="w-43.75 object-contain" priority />
      </div>
      <div className="flex-1" />

      <div className="flex flex-col w-full">
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center justify-between w-full px-4.25 py-3 border rounded-[5px] border-[#CCB5F0]"
        >
          <span className="text-[18px] font-medium leading-[22.8px] tracking-normal text-[#E0E0E0]">
            전체동의
          </span>
          <CheckIcon checked={allChecked} />
        </button>

        <p className="mt-0.75 text-[12px] font-medium leading-[22.8px] tracking-normal text-[#C1C1C1]">
          툴리 서비스 이용을 위한 약관 동의가 필요해요.
        </p>

        {TERMS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className="flex items-center justify-between w-full mt-6.5 pr-4.25"
          >
            <span className="text-[14.5px] font-medium leading-[22.8px] tracking-normal text-[#E0E0E0]">
              {label}
            </span>
            <CheckIcon checked={checked[id]} />
          </button>
        ))}
      </div>

      <div className="flex-1" />
      <Button onClick={handleNext} className={requiredChecked ? '' : 'opacity-40'}>
        다음
      </Button>
    </div>
  );
}
