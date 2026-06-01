import Image from "next/image";
import ReadingBookTolli from "../../../../../../../public/images/readingBookTolli.svg";

export default function WatchingVerseContainer() {
  return (
    <>
      <Image
        src={ReadingBookTolli}
        alt="reading_book_tolli"
        className="w-27.5 h-auto drop-shadow-[0.25rem_0.6875rem_1.5rem_rgba(255,255,255,0.25)]"
      />

      <div className="flex flex-1 items-center text-center">
        <p className="font-normal text-[1.25rem] leading-7.75 tracking-[-0.02em] text-[#F1F1F1]">
          대저 하나님께로서 난 자마다 세상을 이기느니라 세상을 이긴 이김은
          이것이니 우리의 믿음이니라
        </p>
      </div>
      <p className="font-normal text-[0.875rem] leading-5 tracking-[0.03em] text-[#F1F1F1]">
        민수기 6:24
      </p>
    </>
  );
}
