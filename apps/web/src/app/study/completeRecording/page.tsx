"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import FullTolli from "../../../../public/images/onBoarding/fullTolli.svg";
import EatingTolli from "../../../../public/images/onBoarding/eatingTolli.svg";
import CircleLoading from "./_components/CircleLoading";
import Header from "./_components/Header";
import Star1 from "../../../../public/images/star1.svg";
import Star2 from "../../../../public/images/star2.svg";
import { useRouter, useSearchParams } from "next/navigation";

function CompleteStepInner() {
  const router = useRouter();
  const [component, setComponent] = useState(false);

  const verseId = useSearchParams().get("verseId");

  useEffect(() => {
    const time = setTimeout(() => {
      setComponent(true);
    }, 3000);
    return () => clearTimeout(time);
  }, []);

  useEffect(() => {
    if (!component) return;
    const time = setTimeout(() => {
      router.push(`/study/listen?verseId=${verseId}`);
    }, 3000);
    return () => clearTimeout(time);
  }, [component, router, verseId]);

  return (
    <div
      className="grid grid-rows-3 h-full pt-[clamp(1.5rem,11vw,2.6875rem)] pb-[clamp(1.25rem,9.5vw,2.3125rem)] px-[clamp(1rem,6.5vw,1.5625rem)]"
    >
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

export default function CompleteStep() {
  return (
    <Suspense>
      <CompleteStepInner />
    </Suspense>
  );
}
