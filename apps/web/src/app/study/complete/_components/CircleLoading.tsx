export default function CircleLoading({ component }: { component: boolean }) {
  return (
    <svg
      className={`
        absolute inset-0 w-full h-full animate-spin [animation-duration:3s]
        ${component ? "[animation-play-state:paused]" : "[animation-play-state:running]"}`}
      viewBox="0 0 197 197"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="welcome-ring-gradient"
          x1="-17.3459"
          y1="-9.29245"
          x2="197"
          y2="119.563"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="black" />
          <stop offset="1" stopColor="#CCB5F0" />
        </linearGradient>
      </defs>
      <circle
        cx="98.5"
        cy="98.5"
        r="93"
        stroke="url(#welcome-ring-gradient)"
        strokeWidth="8"
      />
    </svg>
  );
}
