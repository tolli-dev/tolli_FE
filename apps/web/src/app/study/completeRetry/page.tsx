"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ReadingBookTolli from "../../../../public/images/readingBookTolli.webp";

export default function CompleteRetry() {
  const router = useRouter();

  const handleHome = () => {
    router.push("/dashboard");
  };

  return (
    <section
      className="flex flex-col w-full h-full items-center
      px-[clamp(1.5rem,10.8vw,2.625rem)]
      pt-[clamp(2.5rem,13.6vw,3.3125rem)]
      pb-[clamp(1.25rem,7.7vw,1.875rem)]"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(2rem,10.3vw,2.5rem)]">
        <h2 className="text-center font-semibold text-[clamp(1.125rem,5.6vw,1.375rem)] leading-[clamp(1.625rem,7.9vw,1.9375rem)] text-[#CCB5F0] break-keep">
          말씀을 다시 떠올렸어요!
        </h2>
        <Image
          src={ReadingBookTolli}
          alt="책 읽는 톨리"
          className="w-[clamp(8rem,45vw,11rem)] h-auto"
        />
      </div>

      <button
        type="button"
        onClick={handleHome}
        aria-label="홈으로 이동"
        className="w-full shrink-0 bg-[#CCB5F0] flex items-center justify-center
        py-[clamp(0.625rem,3.3vw,0.8125rem)] rounded-[clamp(1rem,5vw,1.25rem)]
        text-[clamp(0.875rem,4vw,1rem)] font-medium text-[#1B1B1B]"
      >
        홈으로
      </button>
    </section>
  );
}
