'use client';

import { useEffect, useRef } from 'react';

const SNAP_HEIGHT = 67;
const VISUAL_OFFSETS = [-141, -92, 0, 92, 141];
const ITEM_SIZES = [
  { fontSize: '1.375rem', color: '#4F4F4F', h: 40 },
  { fontSize: '1.75rem', color: '#4F4F4F', h: 40 },
  { fontSize: '4.875rem', color: '#CCB5F0', h: 67 },
  { fontSize: '1.75rem', color: '#4F4F4F', h: 40 },
  { fontSize: '1.375rem', color: '#4F4F4F', h: 40 },
];
const PICKER_HEIGHT = 141 * 2 + 40;

interface WheelPickerProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export default function WheelPicker({ items, selectedIndex, onChange }: WheelPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isDragging.current) return;
    el.scrollTop = selectedIndex * SNAP_HEIGHT;
  }, [selectedIndex]);

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
