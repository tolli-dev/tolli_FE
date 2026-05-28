"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FullTolli from "../../../../public/images/onBoarding/fullTolli.svg";
import ActiveSoundBar from "../../../../public/images/activeSoundBar.svg";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function CompleteStep() {
  const [components, setComponents] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const time = setTimeout(() => {
      setComponents(true);
    }, 2000);
    return () => clearTimeout(time);
  }, []);

  return (
    <div
      onClick={() => router.push("/study/bookmark")}
      className="grid grid-rows-3 min-h-screen pt-[clamp(1.5rem,11vw,2.6875rem)] pb-[clamp(1.25rem,9.5vw,2.3125rem)] px-[clamp(1rem,6.5vw,1.5625rem)]"
    >
      <div className="flex items-center justify-center text-center">
        {components && (
          <div className="flex flex-col gap-[clamp(0.875rem,5.5vw,1.375rem)]">
            <h2 className="font-semibold text-[clamp(1.25rem,6.5vw,1.625rem)] leading-[clamp(1.5rem,8.5vw,2.125rem)] text-[#CCB5F0]">
              완료!
            </h2>
            <div>
              <p className="font-medium text-[clamp(1rem,5vw,1.25rem)] leading-[clamp(1.25rem,7.5vw,1.875rem)] text-[#C8C8C8]">
                오늘의 말씀을 주셔서 감사해요!
              </p>
              <p className="font-medium text-[clamp(1rem,5vw,1.25rem)] leading-[clamp(1.25rem,7.5vw,1.875rem)] text-[#C8C8C8]">
                톨리 배불러요!
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-[clamp(11rem,55vw,13.375rem)] h-[clamp(11rem,55vw,13.375rem)]">
          <svg
            className="absolute inset-0 w-full h-full animate-spin [animation-duration:3s]"
            viewBox="0 0 197 197"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="welcome-ring-gradient"
                x1="-17.3459"
                y1="-9.29245"
                x2="197"
                y2="119.563"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="black" />
                <stop offset="1" stopColor="#CCB5F0" />
              </linearGradient>
            </defs>
            <circle
              cx="98.5"
              cy="98.5"
              r="93"
              stroke="url(#welcome-ring-gradient)"
              strokeWidth="11"
            />
          </svg>
          <Image
            src={FullTolli}
            alt="full tolli"
            fill
            className="object-contain z-10 scale-[1.35]
            -translate-y-[clamp(2rem,8vw,3rem)]
            translate-x-[clamp(0.5rem,3vw,1rem)]"
          />
        </div>
      </div>

      <div className="flex items-end justify-center text-center">
        {components && (
          <div className="flex flex-1 min-h-0 justify-center gap-[clamp(1rem,6vw,1.625rem)] w-full">
            <div className="flex h-full w-full items-center rounded-full bg-linear-to-tr from-[#CCB5F0] to-[#75688A] p-0.5">
              <div className="flex w-full items-center justify-center rounded-full bg-bg p-[clamp(0.625rem,4vw,1rem)]">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-center gap-[clamp(0.25rem,1.75vw,0.4375rem)]">
                    <Icon
                      icon="fluent:people-20-filled"
                      className="text-[#CCB5F0] text-[clamp(1rem,5.25vw,1.3125rem)]"
                    />
                    <h4 className="text-[#C8C8C8] font-medium text-[clamp(0.8125rem,4vw,1rem)] leading-[clamp(1.25rem,7.5vw,1.875rem)]">
                      오늘 <span className="text-[#CCB5F0]">128</span>명이 함께
                      읽고 있어요
                    </h4>
                  </div>
                  <p className="font-medium text-[clamp(0.6875rem,3.25vw,0.8125rem)] leading-[clamp(1.25rem,7.5vw,1.875rem)] text-[#6C6C6C] text-center">
                    함께 고백하는 목소리를 들어보세요.
                  </p>
                  <Image
                    src={ActiveSoundBar}
                    alt="active sound bar"
                    className="w-0 min-w-full h-auto"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {}}
                  aria-label="재생"
                  className="
                    flex items-center justify-center w-[clamp(1.75rem,9vw,2.25rem)] h-[clamp(1.75rem,9vw,2.25rem)] rounded-full
                    bg-[#3A3340] hover:bg-[#4A4350] transition-colors shrink-0
                    translate-x-[clamp(0.75rem,5vw,1.25rem)]"
                >
                  <Icon
                    icon="mdi:play"
                    className="text-[#CCB5F0] text-[clamp(1.5rem,8vw,2rem)]"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
