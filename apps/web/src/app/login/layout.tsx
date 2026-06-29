interface Props {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: Props) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full">
      {children}
    </div>
  );
}
