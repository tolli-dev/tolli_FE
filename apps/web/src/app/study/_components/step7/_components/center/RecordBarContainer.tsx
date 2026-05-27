import Image from "next/image";
import StandingTolli from "../../../../../../../public/images/onBoarding/standingTolli_1.svg";

export default function RecordBarContainer({
  description,
  recordIcon: RecordIcon,
  soundBar,
}: {
  description: string;
  recordIcon?: () => JSX.Element;
  soundBar: string;
}) {
  return (
    <>
      <div className="flex flex-col h-full w-full items-center rounded-[3.125rem] bg-linear-to-tr from-[#917DB0] to-[#7A7A7A] p-0.5 w-full">
        <div className="flex flex-1 flex-col w-full items-center rounded-[3.125rem] bg-bg p-4">
          <div className="flex-1" />
          <div className="flex flex-col items-center">
            <Image
              src={StandingTolli}
              alt="standing tolli"
              className="w-27.5 h-auto drop-shadow-[0.25rem_0.6875rem_1.5rem_rgba(255,255,255,0.25)]"
            />
            <Image
              src={soundBar}
              alt={`${soundBar}`}
              className="w-full h-auto"
            />
          </div>
          <div className="flex-1 flex items-end">
            <div className="flex flex-row items-center gap-2">
              {RecordIcon && <RecordIcon />}
              <p className="font-normal text-[0.8125rem] leading-7.75 text-[#B0B0B0]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
