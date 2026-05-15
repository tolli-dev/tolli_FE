import FullTolli from '../../../../public/images/onBoarding/fullTolli.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <section className="flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)">
      <div className="flex flex-row justify-center items-center gap-[1.125rem] mt-[clamp(1.5rem,5dvh,3rem)]">
        <div className="w-[0.438rem] h-[0.438rem] rounded-full bg-primary-50"></div>
        <div className="w-[0.438rem] h-[0.438rem] rounded-full bg-primary-50"></div>
        <div className="w-[0.438rem] h-[0.438rem] rounded-full bg-primary-50"></div>
      </div>

      <div className="flex flex-col items-center flex-1 w-full mt-[clamp(1.5rem,6dvh,3.813rem)] mb-[clamp(1.5rem,3dvh,6.063rem)]">
        <div className="relative w-[1.938rem] h-[1.938rem] rounded-full bg-surface-100 mb-[0.438rem]">
          <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-bg text-h1 leading-none ml-[-1px]">
            3
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-[0.125rem] mb-[clamp(1.5rem,5dvh,3.813rem)] mt-[0.438rem]">
          <h1 className="text-h1 text-primary-50">양식이 새겨져요</h1>
          <h2 className="text-h2 text-surface-200">tolli를 먹일수록</h2>
        </div>

        <div className="relative w-full max-w-[16.125rem] aspect-square">
          <Image src={FullTolli} fill alt="hungryTolli" className="object-contain" />
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <p className="text-b2 text-surface-300 mb-[0.938rem]">일상 속에서 말씀이 나를 먹여요</p>
        <Link href="/afterLogin/setNickName" className="w-full max-w-[19.688rem]">
          <button className="w-full h-[3rem] text-btn-lg text-primary-75 bg-surface-500 rounded-[1.25rem]">
            다음
          </button>
        </Link>
      </div>
    </section>
  );
}
