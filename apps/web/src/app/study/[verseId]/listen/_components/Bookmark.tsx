import Image from "next/image";
import ReadingBookTolli from "../../../../../../public/tolli1.svg";
import SetBookmarkButton from "./SetBookmarkButton";
import { useRouter } from "next/navigation";
import { addBookmark } from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";

export default function Bookmark({ verseId }: { verseId: number }) {
  const router = useRouter();

  const handleYes = async () => {
    await addBookmark(dataConnect, { verseId });
    router.push("/study/completeListening?type=yes");
  };

  const handleNo = () => {
    router.push("/study/completeListening?type=no");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-[clamp(0.875rem,5vw,1.25rem)]">
      <div className="w-full max-w-90 rounded-[clamp(1rem,6vw,1.5rem)] bg-linear-to-br from-white/30 via-white/15 to-white/20 p-px">
        <div className="flex flex-col items-center justify-center w-full py-[clamp(1rem,6vw,1.5rem)] px-[clamp(1rem,6vw,1.5rem)] bg-bg rounded-[clamp(1rem,6vw,1.5rem)]">
          <h3 className="font-semibold text-[clamp(1rem,4.75vw,1.1875rem)] leading-[clamp(1.5rem,7.75vw,1.9375rem)] text-[#CCB5F0] mb-[clamp(0.75rem,4.5vw,1.125rem)]">
            오늘의 말씀을 즐겨찾기 할까요?
          </h3>
          <Image
            src={ReadingBookTolli}
            alt="책 읽는 톨리"
            className="w-[clamp(5rem,24.5vw,6.125rem)] h-[clamp(5rem,24.5vw,6.125rem)] mb-[clamp(0.875rem,5.5vw,1.375rem)]"
          />
          <div className="flex flex-col items-center justify-center mb-[clamp(1.125rem,7.25vw,1.8125rem)]">
            <p className="font-normal text-[clamp(0.625rem,3vw,0.75rem)] leading-[clamp(0.875rem,4.5vw,1.125rem)] text-[#949494]">
              톨리에서는{" "}
              <span className="text-[#CCB5F0]">무료 버전 최대 10구절</span>까지
            </p>
            <p className="font-normal text-[clamp(0.625rem,3vw,0.75rem)] leading-[clamp(0.875rem,4.5vw,1.125rem)] text-[#949494]">
              즐겨찾기를 제공하고 있어요. 홈화면에서 얼마든지
            </p>
            <p className="font-normal text-[clamp(0.625rem,3vw,0.75rem)] leading-[clamp(0.875rem,4.5vw,1.125rem)] text-[#949494]">
              즐겨찾기를 추가하거나 삭제할 수 있어요.
            </p>
          </div>
          <div className="flex flex-col w-full gap-[clamp(0.375rem,2vw,0.5rem)]">
            <SetBookmarkButton
              text="네!"
              color="#CCB5F0"
              handleClick={handleYes}
            />
            <SetBookmarkButton
              text="다음에 할게요!"
              color="#D9D9D9"
              handleClick={handleNo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
