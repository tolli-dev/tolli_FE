import IndividualBookmark from "./_components/IndividaulBookmark";

const bookmarks = [
  {
    verse: {
      id: 1,
      reference: "요한일서 5:4",
      fullText:
        "대저 하나님께로서 난 자마다 세상을 이기느니라 세상을 이긴 이김은 이것이니 우리의 믿음이니라",
    },
    createdAt: "2026-05-30T00:00:00Z",
  },
  {
    verse: {
      id: 2,
      reference: "시편 23:1",
      fullText: "여호와는 나의 목자시니 내가 부족함이 없으리로다",
    },
    createdAt: "2026-05-31T00:00:00Z",
  },
  {
    verse: {
      id: 3,
      reference: "베드로전서 5:7",
      fullText:
        "너희 염려를 다 주께 맡겨 버리라 이는 저가 너희를 권고하심이니라",
    },
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    verse: {
      id: 4,
      reference: "히브리서 13:8",
      fullText: "예수 그리스도는 어제나 오늘이나 영원토록 동일하시니라",
    },
    createdAt: "2026-06-02T00:00:00Z",
  },
  {
    verse: {
      id: 5,
      reference: "벤지 13:8",
      fullText: "벤지는 좋은 형이다. 그러므로 말을 잘 들어야한다.",
    },
    createdAt: "2026-06-03T00:00:00Z",
  },
  {
    verse: {
      id: 6,
      reference: "장주형 01:01",
      fullText: "벤지와 하는 개발을 가장 우선시 할 것이다.",
    },
    createdAt: "2026-06-04T00:00:00Z",
  },
];
export default function Bookmark() {
  return (
    <div className="flex flex-1 flex-col items-center w-full min-h-0">
      <header className="flex flex-col w-full shrink-0 mb-[clamp(0.625rem,3vw,0.9375rem)]">
        <h1 className="text-dashboard-h1">몽디님의 즐겨찾기</h1>
        <h2 className="font-light text-[clamp(0.6875rem,3vw,0.75rem)] leading-[1.6] tracking-[-2%] text-[#353535]">
          톨리 무료 버전에서는
          <span className="font-medium">최대 10구절</span>
          까지 즐겨찾기 할 수 있어요
        </h2>
      </header>

      {bookmarks.length === 0 && (
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              아직 즐겨찾기한 말씀 구절이 없어요
            </p>
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              보관함에서 추가해주세요
            </p>
          </div>
        </main>
      )}

      {bookmarks.length !== 0 && (
        <main className="w-full flex-1 min-h-0 flex flex-col items-center">
          <span className="w-full text-right font-semibold text-[clamp(0.75rem,3.5vw,0.875rem)] leading-[1.6] tracking-[-2%] text-[#686868] shrink-0 mb-[3px]">
            {bookmarks.length}/10
          </span>
          <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] pb-[clamp(2.5rem,12vw,4.375rem)] overflow-auto bookmarks">
            {bookmarks.map((value) => (
              <IndividualBookmark key={value.verse.id} value={value} />
            ))}
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 w-full h-[clamp(12rem,40dvh,20.5625rem)]
            bg-linear-to-t from-[#CCB5F0] from-2% via-[#DFDFDF] via-30% to-transparent to-100%"
          />
        </main>
      )}
    </div>
  );
}
