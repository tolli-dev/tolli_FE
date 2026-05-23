import { Verse } from "./types";
import Link from "next/link";

export default function ReadVerse({ verse }: { verse: Verse }) {
  return (
    <Link className="w-full h-dvh" href={`/study/${verse.id}/1`}>
      <section className="flex flex-col flex-1">
        <div className="flex flex-col mt-[clamp(5rem,20vh,10rem)] justify-center gap-[clamp(2rem,8vw,4.25rem)] px-[clamp(1.5rem,9vw,4.25rem)]">
          <p className="text-center text-[clamp(0.875rem,4vw,1rem)] font-medium leading-5 tracking-[0.03em] text-[#CCB5F0]">
            {verse.reference}
          </p>
          <div className="flex flex-wrap justify-center">
            {verse.words.map((value) => (
              <span
                key={value.index}
                className="px-1 text-[clamp(1.125rem,5vw,1.5rem)] text-[#D7D2DF] leading-[clamp(2rem,8vw,2.875rem)]"
              >
                {value.text}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Link>
  );
}
