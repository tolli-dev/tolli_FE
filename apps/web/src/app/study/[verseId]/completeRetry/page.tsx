"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ReadingBookTolli from "../../../../../public/images/readingBookTolli.webp";

export default function CompleteRetry() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <section className="flex flex-col w-full h-full items-center justify-center gap-[clamp(2rem,10.3vw,2.5rem)]">
      <h2 className="text-center font-semibold text-[clamp(1.125rem,5.6vw,1.375rem)] leading-[clamp(1.625rem,7.9vw,1.9375rem)] text-[#CCB5F0] break-keep">
        말씀을 다시 떠올렸어요!
      </h2>
      <Image
        src={ReadingBookTolli}
        alt="책 읽는 톨리"
        className="w-[clamp(8rem,45vw,11rem)] h-auto"
      />
    </section>
  );
}
