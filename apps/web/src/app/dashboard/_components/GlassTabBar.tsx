"use client";

import { useRef } from "react";
import { playSound } from "@/lib/sound";

type Props = {
  tabs: readonly string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const SWIPE_THRESHOLD = 20;

export default function GlassTabBar({ tabs, activeIndex, onChange }: Props) {
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    moved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) moved.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;

    if (moved.current && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0 && activeIndex < tabs.length - 1) {
        playSound("/sounds/네비게이션 오른쪽 스와이프.mp3");
        onChange(activeIndex + 1);
      } else if (dx > 0 && activeIndex > 0) {
        playSound("/sounds/네비게이션 왼쪽 스와이프.mp3");
        onChange(activeIndex - 1);
      }
    }

    startX.current = null;
    moved.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (moved.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const segmentWidth = rect.width / tabs.length;
    const targetIndex = Math.min(Math.floor(x / segmentWidth), tabs.length - 1);
    onChange(targetIndex);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        startX.current = null;
        moved.current = false;
      }}
      onClick={handleClick}
      className="
        relative inline-grid grid-cols-2
        w-[155px] h-[50px] p-1.5
        rounded-full
        bg-[#303030]
        select-none overflow-hidden
        cursor-pointer
      "
      style={{ touchAction: "pan-y" }}
    >
      <div
        aria-hidden
        className="
          absolute top-1.5 bottom-1.5 left-1.5
          rounded-full
          bg-[#D4C4ED]/20
          backdrop-blur-md backdrop-saturate-150
          border border-white/10
          shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.15)]
          transition-transform duration-300 ease-out
          pointer-events-none
        "
        style={{
          width: `calc(${100 / tabs.length}% - 6px)`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {tabs.map((label, index) => (
        <span
          key={label}
          className={`
            relative z-10
            flex items-center justify-center
            text-[14px] font-semibold leading-[32px]
            tracking-[-0.02em]
            transition-colors duration-200
            pointer-events-none
            ${activeIndex === index ? "text-[#CCB6EF]" : "text-[#C8C0D4]"}
          `}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
