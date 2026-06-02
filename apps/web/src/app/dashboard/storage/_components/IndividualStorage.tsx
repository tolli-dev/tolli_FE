interface Props {
  value: {
    id: string;
    completedAt: string;
    verse: {
      id: number;
      reference: string;
      fullText: string;
    };
  };
}

export default function IndividualStorage({ value }: Props) {
  return (
    <article className="w-full shrink-0 flex flex-col border border-[#CCB5F0] bg-[#C8C8C8]/20 rounded-[clamp(1rem,4.5vw,1.25rem)] py-[clamp(1rem,4.5vw,1.375rem)] px-[clamp(1.125rem,5vw,1.5625rem)]">
      <span className="flex justify-end -mt-[6px] -mb-[6px]">
        <svg
          className="w-[clamp(1.125rem,4.8vw,1.3125rem)] h-[clamp(1.125rem,4.8vw,1.3125rem)] text-[#CCB5F0] fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </span>
      <h3 className="font-semibold text-[clamp(0.875rem,4vw,1rem)] leading-[1.25] text-[#171717] mb-[clamp(0.5rem,2.5vw,0.6875rem)]">
        {value.verse.reference}
      </h3>
      <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535] mb-[12px] break-keep">
        {value.verse.fullText}
      </p>
      <div className="flex justify-end">
        <button
          className="
            w-fit 
            bg-[#6F6F6F] rounded-[20px] px-[19px] py-[5px]
            font-medium text-[12px] leading-[23px] tracking-[-2%] text-[#CCB5F0]"
        >
          다시 떠올리기
        </button>
      </div>
    </article>
  );
}
