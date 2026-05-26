import Image from "next/image";
import StandingTolli from "../../../../../../public/images/onBoarding/standingTolli_1.svg";

export default function CenterContainer({
  description,
  soundBar,
}: {
  description: string;
  soundBar: string;
}) {
  return (
    <>
      <div className="flex-1 min-h-0 rounded-[3.125rem] bg-linear-to-tr from-[#917DB0] to-[#7A7A7A] p-0.5 w-full">
        <div className="flex flex-col h-full w-full items-center justify-center gap-4 rounded-[3.125rem] bg-bg p-4">
          <Image
            src={StandingTolli}
            alt="standing tolli"
            className="w-27.5 h-auto drop-shadow-[4px_11px_24px_rgba(255,255,255,0.25)]"
          />
          <Image src={soundBar} alt={`${soundBar}`} className="w-full h-auto" />
          <p>{description}</p>
        </div>
      </div>
    </>
  );
}
