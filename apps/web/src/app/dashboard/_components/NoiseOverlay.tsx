export default function NoiseOverlay({
  opacity = 0.25,
  frequency = 1.0,
}: {
  opacity?: number;
  frequency?: number;
}) {
  return (
    <div
      className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
}
