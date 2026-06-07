"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LeftEar from "../../../../../public/images/leftEar.svg";
import RightEar from "../../../../../public/images/rightEar.svg";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cornerRadius, setCornerRadius] = useState(0);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.type === "DEVICE_CORNER_RADIUS") {
          setCornerRadius(data.value ?? 0);
        }
      } catch {}
    };
    window.addEventListener("message", handler);
    document.addEventListener("message", handler as unknown as EventListener);

    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "WEB_READY" }),
    );

    return () => {
      window.removeEventListener("message", handler);
      document.removeEventListener(
        "message",
        handler as unknown as EventListener,
      );
    };
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          borderRadius: `${cornerRadius}px`,
          padding: "5px",
          background:
            "conic-gradient(from var(--angle), #000 1%, #CCB5F0 25%, #000 39%, #CCB5F0 71%, #000 95%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "border-spin 3s linear infinite",
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
