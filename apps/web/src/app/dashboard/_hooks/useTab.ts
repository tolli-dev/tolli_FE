import { useState } from "react";

export function useTab() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChange = (tab: number) => {
    setActiveIndex(tab);
  };

  return { activeIndex, onTabChange: handleTabChange };
}
