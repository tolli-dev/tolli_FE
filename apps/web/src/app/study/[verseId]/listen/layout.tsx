"use client";

import Image from "next/image";
import LeftEar from "../../../../../public/images/leftEar.webp";
import RightEar from "../../../../../public/images/rightEar.webp";
import { useDeviceCornerRadius } from "@/hooks/useDeviceCornerRadius";

export default function Layout({ children }: { children: React.ReactNode }) {
  const cornerRadius = useDeviceCornerRadius();

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          borderRadius: `${Math.round(cornerRadius * 0.95)}px`,
          padding: "5px",
          background:
            "conic-gradient(from var(--angle), #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000, #CCB5F0, #000)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "border-spin 6s linear infinite",
        }}
      />
      <Image
        src={LeftEar}
        alt=""
        aria-hidden
        className="absolute right-0 top-1/2 -translate-y-1/2
        w-[clamp(8rem,40vw,14rem)] h-auto z-0 pointer-events-none"
      />
      <Image
        src={RightEar}
        alt=""
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2
        w-[clamp(8rem,40vw,14rem)] h-auto z-0 pointer-events-none"
      />
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
      `}</style>
      {children}
    </div>
  );
}
