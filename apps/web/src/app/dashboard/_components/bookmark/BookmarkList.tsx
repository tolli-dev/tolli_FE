import { BookMarks } from "../../_hooks/useBookmark";
import IndividualBookmark from "./IndividaulBookmark";

interface Props {
  data: BookMarks[];
  onDelete: () => void;
}

export default function BookmarkList({ data, onDelete }: Props) {
  return (
    <main className="w-full flex-1 min-h-0 flex flex-col items-center">
      <span className="w-full text-right font-semibold text-[clamp(0.75rem,3.5vw,0.875rem)] leading-[1.6] tracking-[-2%] text-[#686868] shrink-0 mb-[3px]">
        {data.length}/10
      </span>
      <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] pb-[clamp(2.5rem,12vw,4.375rem)] overflow-auto bookmarks">
        {data.map((value) => (
          <IndividualBookmark
            key={value.verse.id}
            value={value}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[clamp(12rem,40dvh,20.5625rem)]
            bg-linear-to-t from-[#CCB5F0] from-2% via-[#DFDFDF] via-30% to-transparent to-100%"
      />
    </main>
  );
}
