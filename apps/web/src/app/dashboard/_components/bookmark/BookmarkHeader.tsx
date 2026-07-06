interface Props {
  nickname: string;
}

export default function BookmarkHeader({ nickname }: Props) {
  return (
    <header className="flex flex-col w-full shrink-0 mb-[clamp(0.625rem,3vw,0.9375rem)]">
      <h1 className="text-dashboard-h1">{nickname}님의 즐겨찾기</h1>
      <h2 className="font-light text-[clamp(0.6875rem,3vw,0.75rem)] leading-[1.6] tracking-[-2%] text-[#353535]">
        톨리에서는
        <span className="font-medium">최대 10구절</span>
        까지 즐겨찾기 할 수 있어요
      </h2>
    </header>
  );
}
