'use client';

const VOWEL_ROWS = [
  ['ㅑ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅔ'],
  ['ㅕ', 'ㅗ', 'ㅜ', 'ㅡ'],
  ['ㅠ', 'ㅛ', 'ㅐ'],
];

interface HangulKeyboardProps {
  onKey: (key: string) => void;
  wrongKey?: string | null;
}

export default function HangulKeyboard({ onKey, wrongKey }: HangulKeyboardProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 bg-surface-500 px-3 pt-2 flex flex-col gap-2"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}
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
              className="flex items-center justify-center rounded-[8px] bg-[#4a4a4a] text-[#CCB5F0] text-[1.0625rem] font-medium select-none active:brightness-75 h-10 flex-1"
              style={{
                boxShadow: wrongKey === key ? '0 0 0 1.5px #FF0000 inset' : '0 0 0 1.5px transparent inset',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
