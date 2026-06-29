"use client";

import GlassTabBar from "./GlassTabBar";

type Props = {
  activeIndex: number;
  onTabChange: (index: number) => void;
};

const TABS = ["말씀", "즐겨찾기"] as const;

export default function SwipeNav({ activeIndex, onTabChange }: Props) {
  return (
    <GlassTabBar
      tabs={TABS}
      activeIndex={activeIndex}
      onTabChange={onTabChange}
    />
  );
}
