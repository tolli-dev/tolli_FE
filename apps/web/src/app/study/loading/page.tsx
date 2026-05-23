import Image from "next/image";
import ReadingBookTolli from "../../../../public/images/readingBookTolli.svg";

export default function Loading() {
  return (
    <div className="loading-screen flex flex-col h-full ">
      <div className="flex flex-col flex-1 w-full">
        <section className="relative z-[2] flex flex-col flex-1 items-center justify-center">
          <div className="flex flex-col items-center mb-[clamp(1rem,4vw,1.5rem)]">
            <p className="text-step-loading-p text-[#CCB5F0]">두근두근</p>
            <p className="text-step-loading-p text-[#CCB5F0]">오늘의 말씀은?</p>
          </div>
          <Image
            src={ReadingBookTolli}
            alt="reading book tolli"
            className="w-[clamp(12rem,55vw,17rem)] h-[clamp(12rem,55vw,17rem)]"
          />
        </section>
      </div>
    </div>
  );
}
