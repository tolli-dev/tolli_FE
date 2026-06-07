'use client';

const VOWEL_ROWS = [
  ['ㅑ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅔ'],
  ['ㅕ', 'ㅗ', 'ㅜ', 'ㅡ'],
  ['ㅠ', 'ㅛ', 'ㅐ'],
];

interface HangulKeyboardProps {
  onKey: (key: string) => void;
}

export default function HangulKeyboard({ onKey }: HangulKeyboardProps) {
  const keyClass =
    'flex items-center justify-center rounded-[8px] bg-[#4a4a4a] text-[#CCB5F0] text-[1.0625rem] font-medium select-none active:brightness-75';

  return (
    <div
      className="fixed bottom-0 inset-x-0 bg-surface-500 px-3 pt-2 flex flex-col gap-2"
      style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >
      {VOWEL_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-2">
          {row.map((key) => (
            <button
              key={key}
              onPointerDown={(e) => {
                e.preventDefault();
                onKey(key);
              }}
              className={`${keyClass} h-10 flex-1`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
