import Image from "next/image";

export default function Header({
  comment1,
  comment2,
  comment3,
  star1,
  star2,
}: {
  comment1: string;
  comment2: string;
  comment3?: string;
  star1?: string;
  star2?: string;
}) {
  return (
    <div className="flex flex-col gap-[clamp(0.875rem,5.5vw,1.375rem)]">
      <h2 className="relative w-fit mx-auto font-semibold text-[clamp(1.25rem,6.5vw,1.625rem)] leading-[clamp(1.5rem,8.5vw,2.125rem)] text-[#CCB5F0]">
        {star1 && (
          <Image
            src={star1}
            alt="star1"
            className="
              absolute top-0 left-0 -translate-x-[130%] -translate-y-1/4
              w-[clamp(1.5rem,7vw,2.25rem)] h-auto"
          />
        )}
        {comment1}
        {star2 && (
          <Image
            src={star2}
            alt="star2"
            className="
              absolute top-0 right-0 translate-x-[130%] -translate-y-1/4
              w-[clamp(1.5rem,7vw,2.25rem)] h-auto"
          />
        )}
      </h2>
      <div>
        <p className="font-medium text-[clamp(1rem,5vw,1.25rem)] leading-[clamp(1.25rem,7.5vw,1.875rem)] text-[#C8C8C8]">
          {comment2}
        </p>
        {comment3 && (
          <p className="font-medium text-[clamp(1rem,5vw,1.25rem)] leading-[clamp(1.25rem,7.5vw,1.875rem)] text-[#C8C8C8]">
            {comment3}
          </p>
        )}
      </div>
    </div>
  );
}
