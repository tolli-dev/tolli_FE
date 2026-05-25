"use client";

import Image from "next/image";
import ReadingBookTolli from "../../../../public/images/readingBookTolli.svg";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Loading() {
  const router = useRouter();

  // 백엔드에서 데이터를 다 불러오면 step 미션 페이지로 이동하기
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/study/30/0");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="loading-screen flex flex-col h-full ">
      <div className="flex flex-col flex-1 w-full">
        <section className="relative z-[2] flex flex-col flex-1 items-center justify-center">
          <div className="flex flex-col items-center mb-[clamp(1rem,4vw,1.5rem)]">
            <p className="text-step-loading-p text-[#CCB5F0]">두근두근</p>
            <p className="text-step-loading-p text-[#CCB5F0]">오늘의 말씀은?</p>
          </div>
          <Image
            src={ReadingBookTolli}
            alt="reading book tolli"
            className="w-[clamp(12rem,55vw,17rem)] h-[clamp(12rem,55vw,17rem)]"
          />
        </section>
      </div>
    </div>
  );
}
