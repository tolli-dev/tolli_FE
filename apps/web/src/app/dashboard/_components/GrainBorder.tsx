type Props = {
  color?: string;
  radius?: number;
  strokeWidth?: number;
  frequency?: number;
};

export default function GrainBorder({
  color = "#CCB5F0",
  radius = 20,
  strokeWidth = 6,
  frequency = 0.9,
}: Props) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="grain-border-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={frequency}
            numOctaves="2"
            stitchTiles="stitch"
          />
          {/* 노이즈를 고대비 흑백으로 변환 (마스크용) */}
          <feColorMatrix
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 8 -3"
          />
          {/* stroke 영역과 노이즈를 곱해서 그레인만 남김 */}
          <feComposite in="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={`calc(100% - ${strokeWidth}px)`}
        height={`calc(100% - ${strokeWidth}px)`}
        rx={radius}
        ry={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        filter="url(#grain-border-filter)"
      />
    </svg>
  );
}
