export default function SetBookmarkButton({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <div className="w-full">
      <button
        style={{ backgroundColor: color }}
        className="
          w-full rounded-[clamp(0.875rem,5vw,1.25rem)]
          py-[clamp(0.5rem,3vw,0.75rem)]
          font-semibold text-bg
          text-[clamp(0.8125rem,3.75vw,0.9375rem)]
          leading-[clamp(1.25rem,6.25vw,1.5625rem)]"
      >
        {text}
      </button>
    </div>
  );
}
