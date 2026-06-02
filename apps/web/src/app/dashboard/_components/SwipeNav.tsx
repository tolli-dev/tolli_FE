"use client";

import GlassTabBar from "./GlassTabBar";

type Props = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const TABS = ["말씀", "즐겨찾기"] as const;

export default function SwipeNav({ activeIndex, setActiveIndex }: Props) {
  return (
    <GlassTabBar
      tabs={TABS}
      activeIndex={activeIndex}
      onChange={setActiveIndex}
    />
  );
}
