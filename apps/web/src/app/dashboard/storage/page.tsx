import StorageView from "./_components/StorageView";

const completedVerses = [
  {
    id: "c1a2b3c4-0001-4f1a-8b2c-aa11bb22cc33",
    completedAt: "2026-05-28T09:12:00Z",
    verse: {
      id: 1,
      reference: "요한일서 5:4",
      fullText:
        "대저 하나님께로서 난 자마다 세상을 이기느니라 세상을 이긴 이김은 이것이니 우리의 믿음이니라",
    },
  },
  {
    id: "c1a2b3c4-0002-4f1a-8b2c-aa11bb22cc34",
    completedAt: "2026-05-30T08:05:00Z",
    verse: {
      id: 2,
      reference: "시편 23:1",
      fullText: "여호와는 나의 목자시니 내가 부족함이 없으리로다",
    },
  },
  {
    id: "c1a2b3c4-0002-4f1a-8b2c-aa11bb22cc35",
    completedAt: "2026-05-30T08:05:00Z",
    verse: {
      id: 3,
      reference: "시편 23:1",
      fullText: "여호와는 나의 목자시니 내가 부족함이 없으리로다",
    },
  },
  {
    id: "c1a2b3c4-0002-4f1a-8b2c-aa11bb22cc36",
    completedAt: "2026-05-30T08:05:00Z",
    verse: {
      id: 4,
      reference: "시편 23:1",
      fullText: "여호와는 나의 목자시니 내가 부족함이 없으리로다",
    },
  },
  {
    id: "c1a2b3c4-0002-4f1a-8b2c-aa11bb22cc37",
    completedAt: "2026-05-30T08:05:00Z",
    verse: {
      id: 5,
      reference: "시편 23:1",
      fullText: "여호와는 나의 목자시니 내가 부족함이 없으리로다",
    },
  },
  {
    id: "c1a2b3c4-0002-4f1a-8b2c-aa11bb22cc38",
    completedAt: "2026-05-30T08:05:00Z",
    verse: {
      id: 6,
      reference: "시편 23:1",
      fullText: "여호와는 나의 목자시니 내가 부족함이 없으리로다",
    },
  },
  {
    id: "c1a2b3c4-0001-4f1a-8b2c-aa11bb22cc39",
    completedAt: "2026-05-28T09:12:00Z",
    verse: {
      id: 7,
      reference: "요한일서 5:4",
      fullText:
        "대저 하나님께로서 난 자마다 세상을 이기느니라 세상을 이긴 이김은 이것이니 우리의 믿음이니라",
    },
  },
];
export default async function StoragePage({
  searchParams,
}: {
  searchParams: Promise<{ isDone?: string }>;
}) {
  const { isDone } = await searchParams;
  const done = isDone === "true";

  return <StorageView done={done} completedVerses={completedVerses} />;
}
