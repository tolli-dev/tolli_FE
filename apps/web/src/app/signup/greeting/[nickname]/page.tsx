'use client';

import Image from 'next/image';
import FullHappyTolli from '../../../../../public/images/onBoarding/fullHappyTolli.webp';
import { useParams, useRouter } from 'next/navigation';

export default function Page() {
  const params = useParams<{ nickname: string }>();
  const router = useRouter();
  const decodedNickname = params.nickname ? decodeURIComponent(params.nickname) : '';

  return (
    <section className="relative overflow-hidden flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]">
      <div className="flex flex-col items-center w-full mt-[clamp(1rem,4dvh,10.25rem)]">
        <div className="flex flex-col items-center justify-center w-full gap-[0.125rem]">
          <h1 className="text-h1 text-primary-50">안녕, {decodedNickname}!</h1>
          <h1 className="text-h1 text-primary-50">우리 매일 함께</h1>
          <h1 className="text-h1 text-primary-50">말씀 외워요!</h1>
        </div>
      </div>

      <div className="relative w-full max-w-[16.125rem] aspect-square">
        <div
          className="
            signup-greeting
            absolute top-[120%] left-1/2 -translate-x-1/2 w-[150vw] h-[100dvh] 
            bg-gradient-to-b from-transparent via-primary-75 to-primary-100
            [clip-path:polygon(40%_0%,_60%_0%,_180%_80%,_-80%_80%)] 
            pointer-events-none -z-10 -my-[5.313rem]"
        />
        <Image src={FullHappyTolli} fill alt="happyTolli" className="object-contain" />
      </div>

      <div className="flex flex-col items-center w-full gap-[1rem]">
        <button
          type="button"
          onClick={() => router.push('/signup/set-alarm')}
          className="
            w-full max-w-[19.688rem] h-12 text-btn-lg
            text-primary-75 bg-surface-500 rounded-[1.25rem]
          "
        >
          좋아요!
        </button>
      </div>
    </section>
  );
}
