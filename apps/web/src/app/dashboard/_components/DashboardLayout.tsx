interface Props {
  children: React.ReactNode;
  done: boolean;
}

export default function DashboardLayout({ children, done }: Props) {
  return (
    <section
      className={`
        dashboard-layout
        flex flex-col w-full flex-1 min-h-0 justify-start items-center
        px-[2.688rem] py-[clamp(2rem,5svh,5.313rem)]
        ${done ? "is-done" : ""}
      `}
    >
      {children}
    </section>
  );
}
