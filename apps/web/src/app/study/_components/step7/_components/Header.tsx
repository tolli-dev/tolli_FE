export default function Header({
  instruction1,
  instruction2,
}: {
  instruction1: string;
  instruction2: string;
}) {
  return (
    <>
      <header className="flex shrink-0 items-center justify-center mb-9.75">
        <h2 className="font-semibold text-[1.375rem] leading-8 text-[#CCB5F0] text-center">
          {instruction1} <br /> {instruction2}
        </h2>
      </header>
    </>
  );
}
