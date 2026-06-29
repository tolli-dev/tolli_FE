interface Props {
  nickname: string;
}

export default function Nickname({ nickname }: Props) {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-dashboard-h1">{nickname}님,</h1>
      <h1 className="text-dashboard-h1">안녕하세요!</h1>
    </div>
  );
}
