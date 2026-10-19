import Image from 'next/image';

interface NoticeModalProps {
  onClose: () => void;
  onHideForever: () => void;
}

export default function NoticeModal({ onClose, onHideForever }: NoticeModalProps) {
  return (
    <div className="fixed inset-0 z-9998 flex items-center justify-center bg-black/60 px-[clamp(1.25rem,6vw,2rem)]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-title"
        className="flex w-full max-w-[22rem] flex-col items-center gap-[clamp(1rem,3dvh,1.25rem)] rounded-[1.5rem] bg-[#2A2A2A] px-[clamp(1.25rem,5vw,1.5rem)] pt-[clamp(1.75rem,5dvh,2.25rem)] pb-[clamp(1rem,3dvh,1.25rem)]"
      >
        <h2
          id="notice-title"
          className="text-center font-bold text-[#CCB5F0] text-[clamp(1.25rem,5.5vw,1.5rem)] leading-[1.35]"
        >
          새로운 기능을 준비하고 있어요
        </h2>
        <p className="text-center text-[#ADADAD] text-[clamp(0.9375rem,4vw,1.0625rem)] leading-[1.55]">
          톨리를 사용해주셔서 감사해요
          <br />
          조금만 기다려주세요!
        </p>
        <Image
          src="/tolli2.webp"
          alt=""
          width={140}
          height={140}
          className="h-auto w-[clamp(6rem,32vw,8.75rem)] object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-[1.25rem] bg-[#CCB5F0] py-[clamp(0.75rem,2dvh,0.875rem)] font-bold text-[#1B1B1B] text-[clamp(1rem,4.5vw,1.125rem)] leading-[1.3] active:scale-[0.98] transition-transform"
        >
          확인
        </button>
        <button
          type="button"
          onClick={onHideForever}
          className="text-[#858585] text-[clamp(0.8125rem,3.5vw,0.875rem)] underline underline-offset-4"
        >
          다시 보지 않기
        </button>
      </section>
    </div>
  );
}
