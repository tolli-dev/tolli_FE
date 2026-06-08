"use client";

import Image from "next/image";
import ReadingBookTolli from "../../../../public/images/readingBookTolli.svg";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { playSound } from "@/lib/sound";

export default function CompleteListening() {
  const router = useRouter();

  useEffect(() => {
    playSound("/sounds/말씀 step 7까지 다 완료.mp3");
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const type = useSearchParams().get("type");
  const message =
    type === "yes" ? "오늘의 말씀 즐겨찾기 완료!" : "오늘의 말씀 완료!";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-[clamp(2rem,10.3vw,2.5rem)]">
      <h2 className="text-center font-semibold text-[clamp(1.125rem,5.6vw,1.375rem)] leading-[clamp(1.625rem,7.9vw,1.9375rem)] text-[#CCB5F0]">
        {message}
      </h2>
      <Image
        src={ReadingBookTolli}
        alt="책 읽는 톨리"
        className="w-[clamp(4.5rem,25vw,6.125rem)] h-auto"
      />
    </div>
  );
}
