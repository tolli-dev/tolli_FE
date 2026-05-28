"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FullTolli from "../../../../public/images/onBoarding/fullTolli.svg";
import ActiveSoundBar from "../../../../public/images/activeSoundBar.svg";
import { Icon } from "@iconify/react";

export default function CompleteStep() {
  const [components, setComponents] = useState(false);

  useEffect(() => {
    const time = setTimeout(() => {
      setComponents(true);
    }, 2000);
    return () => clearTimeout(time);
  }, []);

  return (
    <div className="grid grid-rows-3 min-h-screen pt-[43px] pb-[37px] px-[25px]">
      <div className="flex items-center justify-center text-center">
        {components && (
          <div className="flex flex-col gap-[22px]">
            <h2 className="font-semibold text-[26px] leading-[34px] text-[#CCB5F0]">
              완료!
            </h2>
            <div>
              <p className="font-medium text-[20px] leading-[30px] text-[#C8C8C8]">
                오늘의 말씀을 주셔서 감사해요!
              </p>
              <p className="font-medium text-[20px] leading-[30px] text-[#C8C8C8]">
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
          <div className="flex flex-1 min-h-0 justify-center gap-6.5 w-full">
            <div className="flex h-full w-full items-center rounded-[92px] bg-linear-to-tr from-[#CCB5F0] to-[#75688A] p-0.5">
              <div className="flex w-full items-center justify-center rounded-[92px] bg-bg p-4">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-center gap-[7px]">
                    <Icon
                      icon="fluent:people-20-filled"
                      className="text-[#CCB5F0] text-[21px]"
                    />
                    <h4 className="text-[#C8C8C8] font-medium text-[16px] leading-[30px]">
                      오늘 <span className="text-[#CCB5F0]">128</span>명이 함께
                      읽고 있어요
                    </h4>
                  </div>
                  <p className="font-medium text-[13px] leading-[30px] text-[#6C6C6C] text-center">
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
                    flex items-center justify-center w-[36px] h-[36px] rounded-full
                    bg-[#3A3340] hover:bg-[#4A4350] transition-colors shrink-0
                    translate-x-[20px]"
                >
                  <Icon
                    icon="mdi:play"
                    className="text-[#CCB5F0] text-[32px]"
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
