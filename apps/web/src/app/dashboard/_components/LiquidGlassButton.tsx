import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

const BUTTON_WIDTH = 300;
const BUTTON_HEIGHT = 56;

export default function LiquidGlassButton({ children, ref, ...props }: Props) {
  return (
    <>
      {/* 애니메이션 키프레임 정의
        (Tailwind 설정이나 global.css로 분리하는 것을 권장합니다)
      */}
      <style>{`
        @keyframes waterdrop-pulse {
          0%, 100% { transform: scale(1) translateZ(0); }
          50% { transform: scale(1.02) translateZ(0); }
        }
        @keyframes shimmer-move {
          0% { background-position: 0% -200%; }
          100% { background-position: 0% 200%; }
        }
        .animate-waterdrop {
          animation: waterdrop-pulse 4s ease-in-out infinite;
        }
        .animate-shimmer {
          background-size: 100% 200%;
          animation: shimmer-move 3s linear infinite;
        }
      `}</style>

      <button
        ref={ref}
        /* 그룹 Hover 액션과 물방울 호흡(Pulse) 애니메이션 적용 */
        className="relative overflow-hidden rounded-[60px] transform-gpu isolate group animate-waterdrop transition-transform hover:scale-105 active:scale-95"
        style={{
          width: `${BUTTON_WIDTH}px`,
          height: `${BUTTON_HEIGHT}px`,
          WebkitBackfaceVisibility: "hidden",
          /* [핵심 1] 진짜 물방울을 만드는 입체 다중 섀도우 */
          boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.9),  /* 최상단 강한 빛 맺힘 */
            inset 0 -4px 10px rgba(0, 0, 0, 0.15),     /* 바닥면에 깔리는 어두운 굴절 */
            inset 0 8px 20px rgba(255, 255, 255, 0.4), /* 내부를 채우는 은은한 반사광 */
            0 8px 24px rgba(0, 0, 0, 0.15)             /* 공중에 떠 있는 듯한 외부 섀도우 */
          `,
          /* [핵심 2] 베이스 표면 그라데이션 (볼록한 렌즈 느낌) */
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 100%)",
        }}
        {...props}
      >
        {/* 레이어 1: 굴절(Refraction) 담당 (기존 SVG 맵과 연동) */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backdropFilter: "var(--liquid-glass-filters), blur(12px)",
            WebkitBackdropFilter: "var(--liquid-glass-filters), blur(12px)",
          }}
        />

        {/* 레이어 2: 일렁이는 표면 빛 반사 (Shimmer Animation) */}
        <div
          className="absolute inset-0 rounded-[60px] pointer-events-none opacity-50 animate-shimmer mix-blend-overlay"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
          }}
        />

        {/* 레이어 3: 모서리 윤곽선 하이라이트 (Specular Rim) */}
        <div
          className="absolute inset-0 rounded-[60px] pointer-events-none border-[1.5px] border-white/70"
          style={{
            maskImage:
              "linear-gradient(180deg, black 0%, transparent 30%, transparent 70%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, black 0%, transparent 30%, transparent 70%, black 100%)",
          }}
        />

        {/* 레이어 4: 콘텐츠 (글자 가독성을 위해 drop-shadow 추가) */}
        <div className="absolute inset-0 inline-flex items-center justify-center font-bold text-white z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] text-lg">
          {children}
        </div>
      </button>

      {/* SVG 맵핑 영역 (기존 코드 그대로 유지) */}
      <svg style={{ display: "none" }}>
        <defs>
          <filter
            id="liquid-glass-button"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="1"
              result="blurred_source"
            />
            <feImage
              href="images/style/distortion.png"
              x="0"
              y="0"
              width={BUTTON_WIDTH}
              height={BUTTON_HEIGHT}
              result="displacement_map"
            />
            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              scale="55"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix
              in="displaced"
              type="saturate"
              values="50"
              result="displaced_saturated"
            />
            <feImage
              href="/images/style/specular.png"
              x="0"
              y="0"
              width={BUTTON_WIDTH}
              height={BUTTON_HEIGHT}
              result="specular_layer"
            />
            <feGaussianBlur
              in="specular_layer"
              stdDeviation="1"
              result="specular_layer_blurred"
            />
            <feComposite
              in="displaced_saturated"
              in2="specular_layer_blurred"
              operator="in"
              result="specular_saturated"
            />
            <feBlend in="specular_saturated" in2="displaced" mode="normal" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
