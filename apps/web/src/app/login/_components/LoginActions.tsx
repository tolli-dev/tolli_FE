interface Props {
  children: React.ReactNode;
}

export default function LoginActions({ children }: Props) {
  return <div className="mt-auto w-full">{children}</div>;
}
