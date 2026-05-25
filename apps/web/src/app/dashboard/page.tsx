"use client";

import { useState } from "react";
import BeforeFinish from "./BeforeFinish";
import AfterFinish from "./AfterFinish";

export default function DashBoard() {
  const [done, setDone] = useState(false);

  return (
    <section
      className={`
        dashboard-layout
        flex flex-col w-full flex-1 justify-between items-center
        px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]
        ${done ? "is-done" : ""}
      `}
    >
      {done ? <AfterFinish /> : <BeforeFinish />}
    </section>
  );
}
