"use client";

import Image from "next/image";
import TimeTolly from "../../../../public/images/onBoarding/timeTolli.webp";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAlarm = () => {
    try {
      setLoading(true);
      setError(null);
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "REQUEST_NOTIFICATION_PERMISSION" }),
      );
      router.push("/signup/set-alarm-time");
    } catch {
      setLoading(false);
      setError("오류가 발생했어요. 다시 시도해주세요.");
    }
  };

  const skipAlarm = () => {
    try {
      setLoading(true);
      setError(null);
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "SET_LOGGED_IN" }),
      );
      router.push("/dashboard");
    } catch {
      setLoading(false);
      setError("오류가 발생했어요. 다시 시도해주세요.");
    }
  };

  return (
    <section className="flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <LoadingSpinner />
        </div>
      )}
      <div className="flex flex-col items-center w-full mt-[clamp(1rem,4dvh,10.25rem)]">
        <div className="flex flex-col items-center justify-center w-full gap-[0.563rem]">
          <div className="flex flex-col items-center justify-center gap-0.5">
            <h1 className="text-h1 text-primary-50 whitespace-nowrap">
              말씀이 찾아오는 시간,
            </h1>
            <h1 className="text-h1 text-primary-50 whitespace-nowrap">
              톨리가 알려드릴게요!
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5">
            <h2 className="text-h2 text-surface-200 whitespace-nowrap">
              매일 정해진 시간에 조용히 알려드려요.
            </h2>
            <h2 className="text-h2 text-surface-200 whitespace-nowrap">
              tolli가 배고프면 찾아가요.
            </h2>
          </div>
        </div>

        <div className="relative w-full max-w-64.5 aspect-square">
          <Image
            src={TimeTolly}
            fill
            alt="timeTolli"
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-[0.563rem]">
        {error && (
          <p className="text-red-400 text-[0.8125rem] text-center">{error}</p>
        )}
        <button
          type="button"
          onClick={requestAlarm}
          disabled={loading}
          className="
              w-full max-w-[19.688rem] h-12 text-btn-lg
              text-bg bg-primary-75 rounded-[1.25rem] whitespace-nowrap
            "
        >
          알림 허용할래요
        </button>
        <div className="flex items-center">
          <p
            onClick={skipAlarm}
            className="flex w-full text-primary-75 text-no-alarm underline decoration-primary-75 cursor-pointer whitespace-nowrap"
          >
            나중에 설정할게요
          </p>
        </div>
      </div>
    </section>
  );
}
