'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TodayVerse } from '../../page';
import { playSound } from '@/lib/sound';

const DRAG_CLOSE_RATIO = 0.4;

interface Props {
  todayVerse: TodayVerse;
}

export default function RecommendedTodayVerse({ todayVerse }: Props) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [translateY, setTranslateY] = useState('100%');
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openInfo = () => {
    playSound('/sounds/말씀 잠깐 보기 카드 공개_비공개.mp3');
    setIsInfoOpen(true);
    setTranslateY('100%');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTranslateY('0px'));
    });
  };

  const closeInfo = () => {
    playSound('/sounds/원래 화면 다시 돌아갈때.mp3');
    setTranslateY('100%');
    setTimeout(() => {
      setIsInfoOpen(false);
    }, 200);
  };

  const handleDragStart = (clientY: number) => {
    const startY = clientY;
    let offset = 0;
    setIsDragging(true);

    const handleMove = (moveClientY: number) => {
      offset = Math.max(0, moveClientY - startY);
      setTranslateY(`${offset}px`);
    };

    const handleEnd = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);

      setIsDragging(false);

      const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
      const shouldClose = sheetHeight > 0 && offset > sheetHeight * DRAG_CLOSE_RATIO;

      if (shouldClose) {
        closeInfo();
      } else {
        setTranslateY('0px');
      }
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    const onTouchEnd = () => handleEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  return (
    <>
      <h3
        className="
              relative z-10
              mb-[clamp(1rem,5vw,1.5rem)]
              text-dashboard-article-h3
            "
      >
        오늘의 말씀
      </h3>

      <div className="mb-[clamp(0.375rem,2vw,0.625rem)]">
        <p className="relative z-10 text-dashboard-article-p">{todayVerse?.fullText}</p>
      </div>

      <div className="relative z-10 w-full flex items-center justify-between gap-[clamp(0.5rem,2vw,0.75rem)]">
        <button
          type="button"
          onClick={openInfo}
          aria-label="KRV 번역본을 사용하는 이유 보기"
          className="
            flex items-center justify-center gap-[0.1875rem]
            w-[3.125rem] h-[1.0625rem]
            rounded-[0.75rem]
            bg-[#919191]/20
            border-[0.03125rem] border-[#CCB5F0]
            whitespace-nowrap
          "
        >
          <span
            className="
              flex items-center justify-center shrink-0
              w-[0.8125rem] h-[0.8125rem]
              rounded-full
              bg-[#D9D9D9]
              border border-[#CCB5EF]
              text-[0.75rem] font-medium text-black
              leading-none
            "
          >
            i
          </span>
          <span className="text-[0.75rem] font-medium text-[#171717] tracking-[0.0225em] leading-none">
            KRV
          </span>
        </button>

        <span className="text-dashboard-article-span whitespace-nowrap">
          {todayVerse?.reference}
        </span>
      </div>

      {mounted &&
        isInfoOpen &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={closeInfo} />
            <div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="krv-info-title"
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-7 pt-3.75 pb-12.5"
              style={{
                backgroundColor: 'rgba(30,30,30,0.1)',
                backdropFilter: 'blur(20px)',
                transform: `translateY(${translateY})`,
                transition: isDragging ? 'none' : 'transform 0.25s ease',
              }}
            >
              <div
                className="flex justify-center pb-4.25 cursor-grab active:cursor-grabbing touch-none"
                onMouseDown={(e) => handleDragStart(e.clientY)}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
              >
                <span className="w-26.25 h-0.75 rounded-full bg-white" />
              </div>

              <h3
                id="krv-info-title"
                className="font-bold text-[1.25rem] leading-11.5 tracking-[0.08em] text-[#1B1B1B] pb-2"
              >
                왜 개역한글(KRV)인가요?
              </h3>

              <hr className="border-[#8B8B8B]" />

              <p
                className="text-[#373737] pt-4"
                style={{
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  lineHeight: '1.4',
                }}
              >
                tolli는 성경 저작권을 존중합니다.
                <br />
                현재는 누구나 부담 없이 말씀을 암송할 수 있도록,
                <br />
                <strong className="font-semibold">저작권이 자유로운 개역한글(KRV)을</strong>{' '}
                사용하고 있습니다.
                <br />
                <br />
                정식 출시 이후에는 개역개정 등
                <br />
                <strong className="font-semibold">다양한 성경 번역본을 지원할 예정입니다.</strong>
              </p>

              <p
                className="text-[#373737] mt-4"
                style={{
                  fontWeight: 400,
                  fontSize: '0.6875rem',
                  lineHeight: '1.1',
                }}
              >
                (*tolli는 특정 교단에 소속되지 않은,
                <br />
                누구나 함께 사용할 수 있는 독립적인 성경 암송 서비스입니다.)
              </p>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
