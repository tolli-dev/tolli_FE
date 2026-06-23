import Image from "next/image";
import StandingTolli from "../../../../../../../../../public/images/onBoarding/standingTolli_1.webp";

export default function CompleteContainer() {
  return (
    <div className="flex flex-col h-full w-full items-center rounded-[3.125rem] bg-linear-to-tr from-[#917DB0] to-[#7A7A7A] p-0.5">
      <div className="flex flex-1 flex-col w-full items-center justify-center rounded-[3.125rem] bg-bg p-4">
        <Image
          src={StandingTolli}
          alt="standing tolli"
          className="w-[44.78vw] h-auto drop-shadow-[0.25rem_0.6875rem_1.5rem_rgba(255,255,255,0.25)]"
        />
      </div>
    </div>
  );
}
