export default function WatchingVerseContainer({ fullText, reference }: { fullText: string; reference: string }) {
  return (
    <>
      <div className="flex flex-1 items-center text-center px-[7.96vw]">
        <p className="font-normal text-[1.25rem] leading-7.75 tracking-[-0.02em] text-[#F1F1F1] break-keep">
          {fullText}
        </p>
      </div>
      <p className="font-normal text-[0.875rem] leading-5 tracking-[0.03em] text-[#F1F1F1]">
        {reference}
      </p>
    </>
  );
}
