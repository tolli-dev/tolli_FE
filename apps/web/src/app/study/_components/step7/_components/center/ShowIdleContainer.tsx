import Image from "next/image";
import StandingTolli from "../../../../../../../public/images/onBoarding/standingTolli_1.svg";

export default function ShowPhaseContainer({
  description,
  recordIcon: RecordIcon,
  soundBar,
  levels,
}: {
  description?: string;
  recordIcon?: () => JSX.Element;
  soundBar: string;
  levels?: number[];
}) {
  return (
    <>
      <div className="flex-1" />
      <div className="flex flex-col items-center">
        <Image
          src={StandingTolli}
          alt="standing tolli"
          className="w-[32.34vw] h-auto drop-shadow-[0.25rem_0.6875rem_1.5rem_rgba(255,255,255,0.25)]"
        />
        {levels?.length ? (
          <div className="flex items-center justify-center gap-[0.4vw] w-[19.15vw] h-[8vw]">
            {levels.map((v, i) => (
              <span
                key={i}
                className="w-[0.5vw] rounded-full bg-[#CCB5F0] transition-[height] duration-75"
                style={{ height: `${Math.max(8, v * 100)}%` }} // 진폭(0~1) → 높이(%)
              />
            ))}
          </div>
        ) : (
          <Image src={soundBar} alt="soundBar" className="w-[19.15vw] h-auto" />
        )}
      </div>
      <div className="flex-1 flex items-end">
        <div className="flex flex-row items-center gap-2">
          {RecordIcon && <RecordIcon />}
          <p className="font-normal text-[0.8125rem] leading-7.75 text-[#B0B0B0]">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}
