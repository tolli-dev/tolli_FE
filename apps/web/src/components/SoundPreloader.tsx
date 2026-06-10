"use client";

import { useEffect } from "react";
import { preloadSounds } from "@/lib/sound";

export default function SoundPreloader() {
  useEffect(() => {
    preloadSounds();
  }, []);

  return null;
}
