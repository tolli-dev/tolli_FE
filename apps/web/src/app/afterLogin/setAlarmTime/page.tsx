'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TimeTolly from '../../../../public/images/onBoarding/timeSetTolli.svg';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const SNAP_HEIGHT = 67;
// 선택 center 기준 오프셋
// ±1: 67/2 + 21(LINE_GAP) + 18 + 40/2 = 92
// ±2: 92 + 40/2 + 9 + 40/2 = 141
const VISUAL_OFFSETS = [-141, -92, 0, 92, 141];
const ITEM_SIZES = [
  { fontSize: '1.375rem', color: '#4F4F4F', h: 40 },
  { fontSize: '1.75rem', color: '#4F4F4F', h: 40 },
  { fontSize: '4.875rem', color: '#CCB5F0', h: 67 },
  { fontSize: '1.75rem', color: '#4F4F4F', h: 40 },
  { fontSize: '1.375rem', color: '#4F4F4F', h: 40 },
];
const PICKER_HEIGHT = 141 * 2 + 40;
const SELECTED_HEIGHT = 67;
const LINE_GAP = 21;
const SELECTION_ZONE = SELECTED_HEIGHT + LINE_GAP * 2;

type Period = '오전' | '오후';

function WheelPicker({
  items,
  selectedIndex,
  onChange,
}: {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = selectedIndex * SNAP_HEIGHT;
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / SNAP_HEIGHT);
    onChange(Math.min(Math.max(index, 0), items.length - 1));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollRef.current?.scrollTop ?? 0;
    scrollRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollTop = startScrollTop.current + (startY.current - e.clientY);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / SNAP_HEIGHT);
    el.scrollTo({ top: index * SNAP_HEIGHT, behavior: 'smooth' });
    onChange(Math.min(Math.max(index, 0), items.length - 1));
  };

  return (
    <div className="relative flex-1" style={{ height: PICKER_HEIGHT }}>
      {/* 시각 레이어: 전체 아이템 렌더링, 위치를 transition으로 부드럽게 */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        {items.map((label, i) => {
          const diff = i - selectedIndex;
          const absDiff = Math.abs(diff);
          if (absDiff > 2) return null;
          const styleIdx = 2 + diff;
          const s = ITEM_SIZES[styleIdx];
          const top = PICKER_HEIGHT / 2 + VISUAL_OFFSETS[styleIdx] - s.h / 2;
          return (
            <span
              key={label}
              style={{
                position: 'absolute',
                top,
                fontSize: s.fontSize,
                color: s.color,
                height: s.h,
                lineHeight: `${s.h}px`,
                transition: 'top 150ms ease, font-size 150ms ease, color 150ms ease',
              }}
              className="font-light tracking-[-0.02em] leading-none select-none"
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* 투명 스크롤 레이어 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 overflow-y-scroll scrollbar-hide opacity-0"
        style={{
          scrollSnapType: 'y mandatory',
          paddingTop: SNAP_HEIGHT * 2,
          paddingBottom: SNAP_HEIGHT * 2,
        }}
      >
        {items.map((item) => (
          <div key={item} style={{ height: SNAP_HEIGHT, scrollSnapAlign: 'center' }} />
        ))}
      </div>
    </div>
  );
}

export default function SetAlarmTimePage() {
  const router = useRouter();
  const [cornerRadius, setCornerRadius] = useState(0);
  const [hourIndex, setHourIndex] = useState(6);
  const [minuteIndex, setMinuteIndex] = useState(0);
  const [period, setPeriod] = useState<Period>('오전');

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.type === 'DEVICE_CORNER_RADIUS') setCornerRadius(data.value ?? 0);
      } catch {}
    };
    window.addEventListener('message', handler);
    document.addEventListener('message', handler as unknown as EventListener);
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'WEB_READY' }));
    return () => {
      window.removeEventListener('message', handler);
      document.removeEventListener('message', handler as unknown as EventListener);
    };
  }, []);

  const handleConfirm = () => {
    const hour24 = period === '오전' ? hourIndex + 1 : (hourIndex === 12 ? 12 : hourIndex + 12);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'SAVE_ALARM_TIME', hour: hour24, minute: minuteIndex }),
    );
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'SCHEDULE_NOTIFICATION', hour: hour24, minute: minuteIndex }),
    );
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SET_LOGGED_IN' }));
    router.push('/dashboard');
  };

  const handleSkip = () => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SET_LOGGED_IN' }));
    router.push('/dashboard');
  };

  return (
    <div className="relative flex flex-col flex-1 h-full w-full px-[2.688rem] pt-[clamp(1rem,3dvh,1.5rem)] pb-[clamp(2rem,5dvh,5.313rem)]">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          borderRadius: `${cornerRadius}px`,
          padding: '3px',
          background: 'conic-gradient(from var(--angle), white, #CCB5F0, white)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'border-spin 3s linear infinite',
        }}
      />

      <button
        onClick={() => router.back()}
        aria-label="뒤로가기"
        className="mb-[clamp(0.75rem,2dvh,1.25rem)] w-fit"
      >
        <svg
          width="9"
          height="16"
          viewBox="0 0 9 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.66667 1L1 7.66667L7.66667 14.3333"
            stroke="#CCB5F0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col justify-center">
          <h1 className="text-h1 text-[#CCB5F0]">톨리가 매일 알려줄게요!</h1>
          <p className="font-light text-[0.75rem] leading-5 text-[#CECECE] mt-px">알림 설정하기</p>
        </div>
        <div className="relative w-16.5 h-16.5 shrink-0">
          <Image src={TimeTolly} fill alt="timeTolli" className="object-contain" />
        </div>
      </div>

      <div className="relative flex flex-row items-center flex-1 w-full">
        <div className="relative flex flex-row items-center flex-1">
          <div
            className="absolute pointer-events-none"
            style={{
              top: `calc(50% - ${SELECTION_ZONE / 2}px)`,
              height: SELECTION_ZONE,
              left: 0,
              right: 0,
            }}
          >
            <div className="absolute top-0 left-0 right-0 border-t-2 border-[#CCB5F0]" />
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-[#CCB5F0]" />
          </div>
          <WheelPicker items={HOURS} selectedIndex={hourIndex} onChange={setHourIndex} />
          <span
            className="text-[#CCB5F0] font-light shrink-0 mx-1"
            style={{ fontSize: '4.875rem', letterSpacing: '-0.02em' }}
          >
            :
          </span>
          <WheelPicker items={MINUTES} selectedIndex={minuteIndex} onChange={setMinuteIndex} />
        </div>

        <div
          className="flex flex-col items-center justify-center shrink-0 ml-3 self-center"
          style={{ gap: '3px' }}
        >
          {(['오전', '오후'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                fontSize: '1.75rem',
                letterSpacing: '-0.07em',
                lineHeight: '2.5rem',
                height: '2.5rem',
              }}
              className={`font-light transition-colors ${period === p ? 'text-[#CCB5F0]' : 'text-[#4F4F4F]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-[0.563rem]">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full max-w-[19.688rem] h-12 text-btn-lg text-primary-75 bg-surface-500 rounded-[1.25rem]"
        >
          이 시간에 알려주세요
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[#9A9A9A] text-no-alarm underline decoration-[#9A9A9A]"
        >
          나중에 설정 할게요
        </button>
      </div>

      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
