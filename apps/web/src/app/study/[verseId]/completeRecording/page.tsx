"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FullTolli from "../../../../../public/images/onBoarding/fullTolli.webp";
import EatingTolli from "../../../../../public/images/onBoarding/eatingTolli.webp";
import CircleLoading from "./_components/CircleLoading";
import Header from "./_components/Header";
import Star1 from "../../../../../public/images/star1.webp";
import Star2 from "../../../../../public/images/star2.webp";
import { useRouter, useParams } from "next/navigation";
import { playSound } from "@/lib/sound";

export default function CompleteStep() {
  const router = useRouter();
  const [component, setComponent] = useState(false);

  const { verseId } = useParams<{ verseId: string }>();

  useEffect(() => {
    const preloads = [Star1.src, Star2.src, FullTolli.src].map((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
      return link;
    });
    return () => {
      preloads.forEach((l) => document.head.removeChild(l));
    };
  }, []);

  useEffect(() => {
    playSound("/sounds/tolli에게 먹이가 전해졌을때.mp3");
    const time = setTimeout(() => {
      setComponent(true);
    }, 3000);
    return () => clearTimeout(time);
  }, []);

  useEffect(() => {
    if (!component) return;
    const time = setTimeout(() => {
      router.push(`/study/${verseId}/listen`);
    }, 3000);
    return () => clearTimeout(time);
  }, [component, router, verseId]);

  return (
    <div className="grid grid-rows-3 h-full pt-[clamp(1.5rem,11vw,2.6875rem)] pb-[clamp(1.25rem,9.5vw,2.3125rem)] px-[clamp(1rem,6.5vw,1.5625rem)]">
      <div className="flex items-center justify-center text-center">
        {!component && (
          <Header
            comment1="말씀 먹는 중..."
            comment2="톨리가 완성된 말씀을 먹고 있어요"
          />
        )}
        {component && (
          <Header
            comment1="완료"
            comment2="오늘의 말씀을 주셔서 감사해요!"
            comment3="톨리 배불러요"
            star1={Star1}
            star2={Star2}
          />
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-full h-full">
          <CircleLoading component={component} />
          {!component && (
            <Image
              src={EatingTolli}
              alt="eating tolli"
              fill
              priority
              className="
                object-contain z-10 scale-[1.0]
                translate-x-[90px]"
            />
          )}
          {component && (
            <Image
              src={FullTolli}
              alt="full tolli"
              fill
              priority
              className="
                object-contain z-10 scale-[1.2]
                translate-x-[10px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
