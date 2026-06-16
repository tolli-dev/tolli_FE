"use client";

import ReadingBookTolli from "../../public/tolli1.webp";
import Image from "next/image";
import { useState, useEffect } from "react";
import CircleLoading from "./study/[verseId]/completeRecording/_components/CircleLoading";

interface Props {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleErrorReset = () => {
    setIsLoading(true);
    reset();
  };

  return (
    <div className="relative flex flex-col flex-1 h-full items-center justify-center px-[clamp(1.5rem,10.8vw,2.625rem)] py-[clamp(1.25rem,9.2vw,2.25rem)]">
      <div
        className="fixed inset-0 pointer-events-none z-110"
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
      <div className="flex flex-col w-full h-full items-center justify-between">
        <div className="flex flex-col w-full h-full items-center justify-center gap-[clamp(1rem,4.8vw,1.875rem)]">
          <h2 className="font-bold text-[clamp(1.375rem,6.6vw,1.625rem)] leading-[clamp(1.75rem,8.7vw,2.125rem)] text-[#CCB5F0]">
            문제가 발생했어요
          </h2>
          <div className="flex flex-col items-center justify-center">
            <p className="text-[clamp(0.9375rem,4.4vw,1.0625rem)] leading-[clamp(1.375rem,6.6vw,1.625rem)] text-[#ADADAD] whitespace-nowrap">
              예상치 못한 오류가 발생했어요
            </p>
            <p className="text-[clamp(0.9375rem,4.4vw,1.0625rem)] leading-[clamp(1.375rem,6.6vw,1.625rem)] text-[#ADADAD] whitespace-nowrap">
              잠시 후 다시 시도해주세요
            </p>
          </div>
          <Image
            alt="책 읽는 톨리"
            src={ReadingBookTolli}
            width={228}
            height={228}
            className="object-contain w-[clamp(9rem,58vw,14.25rem)] h-auto"
            priority
          />
        </div>
        <button
          onClick={handleErrorReset}
          className="
            w-full rounded-[1.25rem] bg-[#CCB5F0] py-[clamp(0.625rem,3.3vw,0.8125rem)]
            font-bold text-[clamp(1rem,4.6vw,1.125rem)] leading-[clamp(1.25rem,5.9vw,1.4375rem)] text-[#1B1B1B]
          "
        >
          다시 시도
        </button>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#1B1B1B]">
          <div className="relative w-[clamp(6rem,35vw,8rem)] aspect-square">
            <CircleLoading />
          </div>
        </div>
      )}

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
    </div>
  );
}
