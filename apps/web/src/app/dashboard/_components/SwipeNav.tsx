"use client";

import { useState } from "react";
import GlassTabBar from "./GlassTabBar";

const TABS = ["말씀", "즐겨찾기"] as const;

export default function SwipeNav() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <GlassTabBar
      tabs={TABS}
      activeIndex={activeIndex}
      onChange={setActiveIndex}
    />
  );
}
