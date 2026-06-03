export default function DiffHeader({
  instruction1,
  instruction2,
}: {
  instruction1: string;
  instruction2: string;
}) {
  return (
    <>
      <header className="flex flex-col shrink-0 items-center justify-center mb-9.75">
        <h2 className="font-semibold text-[1.375rem] leading-8 text-[#CCB5F0] text-center whitespace-nowrap">
          {instruction1}
        </h2>
        <h3 className="font-semibold text-[1.125rem] leading-8.5 text-[#BEBEBE] text-center whitespace-nowrap">
          {instruction2}
        </h3>
      </header>
    </>
  );
}
