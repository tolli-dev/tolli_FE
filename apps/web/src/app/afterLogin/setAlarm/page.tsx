"use client";

import Image from "next/image";
import TimeTolly from "../../../../public/images/onBoarding/timeTolli.svg";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const requestAlarm = () => {
    router.push("/dashboard");
  };

  return (
    <section className="flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]">
      <div className="flex flex-col items-center w-full mt-[clamp(1rem,4dvh,10.25rem)]">
        <div className="flex flex-col items-center justify-center w-full gap-[0.563rem]">
          <div className="flex flex-col items-center justify-center gap-[0.125rem]">
            <h1 className="text-h1 text-primary-50">말씀이 찾아오는 시간,</h1>
            <h1 className="text-h1 text-primary-50">톨리가 알려드릴게요!</h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-[0.125rem]">
            <h2 className="text-h2 text-surface-200">
              매일 정해진 시간에 조용히 알려드려요.
            </h2>
            <h2 className="text-h2 text-surface-200">
              tolli가 배고프면 찾아가요.
            </h2>
          </div>
        </div>

        <div className="relative w-full max-w-[16.125rem] aspect-square">
          <Image
            src={TimeTolly}
            fill
            alt="timeTolli"
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-[0.563rem]">
        <button
          type="button"
          onClick={requestAlarm}
          className="
              w-full max-w-[19.688rem] h-[3rem] text-btn-lg 
              text-bg bg-primary-75 rounded-[1.25rem]
            "
        >
          알림 허용할래요
        </button>
        <div className="flex items-center">
          <p className="flex w-full text-primary-75 text-no-alarm underline decoration-primary-75">
            나중에 설정할게요
          </p>
        </div>
      </div>
    </section>
  );
}
