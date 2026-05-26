import Header from "./_components/Header";
import CenterContainer from "./_components/CenterContainer";
import RecordButton from "./_components/RecordButton";
import FooterButton from "./_components/FooterButton";
import SoundBar from "../../../../../public/images/soundBar.svg";

export default function Stt() {
  return (
    <section className="flex flex-col w-full h-full overflow-hidden pt-8.75 pb-13 px-10.5">
      <Header
        instruction1="말씀을 듣고, 보고"
        instruction2="준비되면 말해보세요."
      />

      <main className="flex flex-col flex-1 min-h-0 justify-center gap-6.5 w-full">
        <CenterContainer soundBar={SoundBar} description="" />
        <RecordButton />
      </main>

      <footer className="grid grid-cols-3 gap-4 shrink-0">
        <FooterButton />
      </footer>
    </section>
  );
}
