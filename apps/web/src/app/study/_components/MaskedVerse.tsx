import { Word } from './types';

interface MaskedVerseProps {
  words: Word[];
  maskedIndices: number[];
  activeIndex: number | undefined;
}

export default function MaskedVerse({ words, maskedIndices, activeIndex }: MaskedVerseProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((word) => {
        const isMasked = maskedIndices.includes(word.index);
        const isActive = activeIndex === word.index;

        if (isMasked) {
          return (
            <span
              key={word.index}
              className={`rounded px-3 py-1 ${isActive ? 'bg-primary-50' : 'bg-surface-100'}`}
            >
              {'　'.repeat(word.text.length)}
            </span>
          );
        }

        return (
          <span key={word.index} className="px-1">
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
