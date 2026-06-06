export interface Word {
  index: number;
  text: string;
  meaning?: string;
}

export interface Verse {
  id: number;
  reference: string;
  words: Word[];
}

export interface StepMaskData {
  step: 2 | 3 | 4 | 5;
  maskedIndices: number[];
}

export interface WordMeaningData {
  index: number;
  text: string;
  word?: string;
  meaning?: string;
}

