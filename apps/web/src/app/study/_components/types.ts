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

export interface StudySession {
  verse: Verse;
  stepMasks: StepMaskData[];
}

export const MOCK_STUDY_SESSION: StudySession = {
  verse: {
    id: 30,
    reference: '요한일서 5:4',
    words: [
      { index: 1, text: '대저' },
      { index: 2, text: '하나님께로서' },
      { index: 3, text: '난' },
      { index: 4, text: '자마다' },
      { index: 5, text: '세상을' },
      { index: 6, text: '이기느니라' },
      { index: 7, text: '세상을' },
      { index: 8, text: '이긴' },
      { index: 9, text: '이김은' },
      { index: 10, text: '이것이니' },
      { index: 11, text: '우리의' },
      { index: 12, text: '믿음이니라' },
    ],
  },
  stepMasks: [
    { step: 2, maskedIndices: [2, 6, 12] },
    { step: 3, maskedIndices: [2, 4, 6, 8, 9, 12] },
    { step: 4, maskedIndices: [2, 3, 4, 5, 6, 8, 9, 10, 12] },
    { step: 5, maskedIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  ],
};
