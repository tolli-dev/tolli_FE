'use client';

const HANGUL_ROWS = [
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
  ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
];

const NUMBER_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '₩', '&', '@', '"'],
  ['.', ',', '?', '!', "'"],
];

interface HangulKeyboardProps {
  onKey: (key: string) => void;
  onDelete: () => void;
  onSpace: () => void;
  mode: 'hangul' | 'number';
  onModeChange: (mode: 'hangul' | 'number') => void;
}

export default function HangulKeyboard({
  onKey,
  onDelete,
  onSpace,
  mode,
  onModeChange,
}: HangulKeyboardProps) {
  const rows = mode === 'hangul' ? HANGUL_ROWS : NUMBER_ROWS;

  const keyClass =
    'flex items-center justify-center rounded-[8px] bg-[#4a4a4a] text-[#CCB5F0] text-[1.0625rem] font-medium select-none active:brightness-75';

  return (
    <div
      className="fixed bottom-0 inset-x-0 bg-surface-500 px-1 pt-2 flex flex-col gap-2"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              onPointerDown={(e) => {
                e.preventDefault();
                onKey(key);
              }}
              className={`${keyClass} h-10`}
              style={{ width: `${Math.min(100 / row.length - 1, 10)}%`, minWidth: '2rem' }}
            >
              {key}
            </button>
          ))}
          {rowIdx === 2 && (
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className={`${keyClass} h-10 px-3`}
              style={{ minWidth: '3rem' }}
            >
              ⌫
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-1.5 justify-center">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            onModeChange(mode === 'hangul' ? 'number' : 'hangul');
          }}
          className={`${keyClass} h-10 px-3 text-[0.875rem]`}
          style={{ minWidth: '3.5rem' }}
        >
          {mode === 'hangul' ? '123' : '한글'}
        </button>

        <button
          onPointerDown={(e) => {
            e.preventDefault();
            onSpace();
          }}
          className={`${keyClass} h-10 flex-1 text-[0.875rem]`}
        >
          간격
        </button>

        <button
          onPointerDown={(e) => {
            e.preventDefault();
          }}
          className={`${keyClass} h-10 px-3`}
          style={{ minWidth: '3rem' }}
        >
          ↵
        </button>
      </div>
    </div>
  );
}
