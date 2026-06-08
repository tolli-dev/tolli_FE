import { Word } from '../types';

interface MaskedVerseProps {
  words: Word[];
  maskedIndices?: number[];
  answeredIndices?: number[];
}

export default function MaskedVerse({ words, maskedIndices = [], answeredIndices = [] }: MaskedVerseProps) {
  return (
    <div className="flex flex-wrap justify-center">
      {words.map((word) => {
        const isMasked = maskedIndices.includes(word.index);
        const isAnswered = answeredIndices.includes(word.index);

        if (isMasked || isAnswered) {
          return (
            <span
              key={word.index}
              className="relative px-1 text-[clamp(1.5rem,6vw,2rem)] leading-[clamp(2.5rem,9vw,3.5rem)] select-none"
              style={{ color: 'transparent' }}
            >
              {word.text}
              {!isAnswered && (
                <span
                  className="absolute inset-x-0 rounded-[15px] overflow-hidden flex items-center justify-center"
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '2rem',
                    backgroundColor: 'rgba(217,217,217,0.08)',
                    boxShadow:
                      '0 4px 4px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.2)',
                  }}
                >
                  <span
                    className="whitespace-nowrap text-[clamp(1.5rem,6vw,2rem)] leading-none"
                    style={{
                      color: 'rgba(204,181,240,0.9)',
                      filter: 'blur(6px)',
                      textShadow: '0 2px 8px rgba(204,181,240,0.4)',
                    }}
                  >
                    {word.text}
                  </span>
                </span>
              )}
              {isAnswered && (
                <span className="absolute inset-0 flex items-center justify-center text-[#D7D2DF]">
                  {word.text}
                </span>
              )}
            </span>
          );
        }

        return (
          <span key={word.index} className="px-1 text-[clamp(1.5rem,6vw,2rem)] text-[#D7D2DF] leading-[clamp(2.5rem,9vw,3.5rem)]">
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
