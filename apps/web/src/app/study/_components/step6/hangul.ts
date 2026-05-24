const CHOSUNGS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];
const JUNGSUNGS = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];
const JONGSUNGS = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const HANGUL_START = 0xac00;

export function isHangulChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= HANGUL_START && code <= 0xd7a3;
}

export function getChosung(char: string): string {
  if (!isHangulChar(char)) return char;
  const code = char.charCodeAt(0) - HANGUL_START;
  return CHOSUNGS[Math.floor(code / (21 * 28))];
}

export function combineHangul(cho: string, jung: string, jong = ''): string {
  const choIdx = CHOSUNGS.indexOf(cho);
  const jungIdx = JUNGSUNGS.indexOf(jung);
  const jongIdx = JONGSUNGS.indexOf(jong);
  if (choIdx < 0 || jungIdx < 0 || jongIdx < 0) return cho;
  return String.fromCharCode(HANGUL_START + (choIdx * 21 + jungIdx) * 28 + jongIdx);
}

export function decomposeHangul(char: string): [string, string, string] {
  if (!isHangulChar(char)) return [char, '', ''];
  const code = char.charCodeAt(0) - HANGUL_START;
  const jong = JONGSUNGS[code % 28];
  const jung = JUNGSUNGS[Math.floor(code / 28) % 21];
  const cho = CHOSUNGS[Math.floor(code / (21 * 28))];
  return [cho, jung, jong];
}

export function isVowel(key: string): boolean {
  return JUNGSUNGS.includes(key);
}

const COMPOUND_VOWEL_MAP: Record<string, string[]> = {
  ㅗ: ['ㅘ', 'ㅙ', 'ㅚ'],
  ㅜ: ['ㅝ', 'ㅞ', 'ㅟ'],
  ㅡ: ['ㅢ'],
};

export function resolveVowel(inputVowel: string, expectedJung: string): string {
  if (inputVowel === expectedJung) return inputVowel;
  const candidates = COMPOUND_VOWEL_MAP[inputVowel];
  if (candidates?.includes(expectedJung)) return expectedJung;
  return inputVowel;
}

export function toChosung(text: string): string {
  return text
    .split('')
    .map((char) => (isHangulChar(char) ? getChosung(char) : char))
    .join('');
}
