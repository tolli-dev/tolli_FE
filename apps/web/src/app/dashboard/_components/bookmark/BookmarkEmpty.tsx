export default function BookmarkEmpty() {
  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center">
      <div className="text-center">
        <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
          아직 즐겨찾기한 말씀 구절이 없어요
        </p>
        <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
          보관함에서 추가해주세요
        </p>
      </div>
    </main>
  );
}
