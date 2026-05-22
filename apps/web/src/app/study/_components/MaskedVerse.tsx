import { Word } from './types';

interface MaskedVerseProps {
  words: Word[];
  maskedIndices: number[];
}

export default function MaskedVerse({ words, maskedIndices }: MaskedVerseProps) {
  return (
    <div className="flex flex-wrap justify-center">
      {words.map((word) => {
        const isMasked = maskedIndices.includes(word.index);

        if (isMasked) {
          return (
            <div
              key={word.index}
              className="relative mx-1 self-center rounded-[15px] overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.2)]"
              style={{
                width: `${word.text.length * 2.4}ch`,
                height: '2rem',
                backgroundColor: 'rgba(217,217,217,0.08)',
                boxShadow:
                  '0 4px 4px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.2)',
              }}
            >
              <span
                className="absolute inset-0 flex items-center rounded-[15px] justify-center text-[1.5rem] leading-none whitespace-nowrap select-none"
                style={{
                  color: 'rgba(204,181,240,0.9)',
                  filter: 'blur(6px)',
                  textShadow: '0 2px 8px rgba(204,181,240,0.4)',
                }}
              >
                {word.text}
              </span>
            </div>
          );
        }

        return (
          <span key={word.index} className="px-1 text-[1.5rem] text-[#D7D2DF] leading-11.5">
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
