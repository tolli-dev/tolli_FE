import NoiseOverlay from "../NoiseOverlay";
import GrainBorder from "../_GrainBorder";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: Props) {
  return (
    <article
      className={`
            relative overflow-hidden w-full
            flex flex-col justify-center
            min-h-[clamp(8rem,38vw,11rem)]
            mb-[clamp(1rem,4vw,1.5rem)]
            rounded-[clamp(16px,5vw,22px)]
            bg-dashboard-article-bg/20
            shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_4px_4px_0_rgba(0,0,0,0.25)]
            ${className ?? ""}
          `}
    >
      <NoiseOverlay />
      <GrainBorder color="#CCB5F0" radius={18} strokeWidth={3} />
      {children}
    </article>
  );
}
