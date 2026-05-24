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

export interface WordMeaningData {
  index: number;
  text: string;
  meaning?: string;
}

export interface StepMaskData {
  step: 2 | 3 | 4 | 5;
  maskedIndices: number[];
  choices: Record<number, string[]>;
}

export interface StudySession {
  verse: Verse;
  wordMeanings: WordMeaningData[];
  stepMasks: StepMaskData[];
}

export const MOCK_STUDY_SESSION: StudySession = {
  verse: {
    id: 30,
    reference: "요한일서 5:4",
    words: [
      { index: 1, text: "대저" },
      { index: 2, text: "하나님께로서" },
      { index: 3, text: "난" },
      { index: 4, text: "자마다" },
      { index: 5, text: "세상을" },
      { index: 6, text: "이기느니라" },
      { index: 7, text: "세상을" },
      { index: 8, text: "이긴" },
      { index: 9, text: "이김은" },
      { index: 10, text: "이것이니" },
      { index: 11, text: "우리의" },
      { index: 12, text: "믿음이니라" },
    ],
  },
  wordMeanings: [
    {
      index: 1,
      text: "대저",
      meaning: "무릇, 왜냐하면 (개역한글의 접속어. 이유·근거를 이끎)",
    },
    {
      index: 2,
      text: "하나님께로서 난",
      meaning: "하나님에게서 태어난 자, 거듭난 자",
    },
    { index: 3, text: "자마다", meaning: "~하는 사람은 누구든지" },
    {
      index: 5,
      text: "세상을 이기느니라",
      meaning: "세상의 유혹·죄악·악한 세력을 이겨내느니라",
    },
    { index: 7, text: "세상을" },
    { index: 8, text: "이긴" },
    { index: 9, text: "이김", meaning: "승리 (勝利)" },
    {
      index: 10,
      text: "이것이니",
      meaning: "바로 이것이니, 다름 아닌 이것이니",
    },
    { index: 11, text: "우리의" },
    {
      index: 12,
      text: "믿음",
      meaning: "예수 그리스도를 향한 신앙, 하나님을 향한 신뢰",
    },
  ],
  stepMasks: [
    {
      step: 2,
      maskedIndices: [2, 6, 12],
      choices: {
        2: ["주님께로서", "하나님께로서", "성령께로서"],
        6: ["이기느니라", "지느니라", "살아가느니라"],
        12: ["소망이니라", "사랑이니라", "믿음이니라"],
      },
    },
    {
      step: 3,
      maskedIndices: [2, 4, 6, 8, 9, 12],
      choices: {
        2: ["주님께로서", "하나님께로서", "성령께로서"],
        4: ["사람마다", "자마다", "누구든지"],
        6: ["이기느니라", "지느니라", "살아가느니라"],
        8: ["이긴", "진", "버린"],
        9: ["이김은", "패배는", "싸움은"],
        12: ["소망이니라", "사랑이니라", "믿음이니라"],
      },
    },
    {
      step: 4,
      maskedIndices: [2, 3, 4, 5, 6, 8, 9, 10, 12],
      choices: {
        2: ["주님께로서", "하나님께로서", "성령께로서"],
        3: ["태어난", "난", "나온"],
        4: ["사람마다", "자마다", "누구든지"],
        5: ["죄악을", "세상을", "어둠을"],
        6: ["이기느니라", "지느니라", "살아가느니라"],
        8: ["이긴", "진", "버린"],
        9: ["이김은", "패배는", "싸움은"],
        10: ["이것이니", "저것이니", "사실이니"],
        12: ["소망이니라", "사랑이니라", "믿음이니라"],
      },
    },
    {
      step: 5,
      maskedIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      choices: {
        1: ["왜냐하면", "대저", "그러므로"],
        2: ["주님께로서", "하나님께로서", "성령께로서"],
        3: ["태어난", "난", "나온"],
        4: ["사람마다", "자마다", "누구든지"],
        5: ["죄악을", "세상을", "어둠을"],
        6: ["이기느니라", "지느니라", "살아가느니라"],
        7: ["하늘을", "세상을", "어둠을"],
        8: ["이긴", "진", "버린"],
        9: ["이김은", "패배는", "싸움은"],
        10: ["이것이니", "저것이니", "사실이니"],
        11: ["나의", "우리의", "너희의"],
        12: ["소망이니라", "사랑이니라", "믿음이니라"],
      },
    },
  ],
};
