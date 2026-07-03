'use client';

import Image from 'next/image';
import TimeTolly from '../../../../public/images/onBoarding/timeTolli.webp';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // 알림 시간 설정으로 이동한다. 실제 권한 요청/로그인 확정은
  // 이후 필수 권한 게이트(/signup/permissions)에서만 수행된다.
  const requestAlarm = () => {
    router.push('/signup/set-alarm-time');
  };

  // 커스텀 알림 시간 지정은 선택 사항. 건너뛰어도 알림 권한 자체는
  // 필수이므로 곧장 권한 게이트로 보낸다.
  const skipAlarm = () => {
    router.push('/signup/permissions');
  };

  return (
    <section className="flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]">
      <div className="flex flex-col items-center w-full mt-[clamp(1rem,4dvh,10.25rem)]">
        <div className="flex flex-col items-center justify-center w-full gap-[0.563rem]">
          <div className="flex flex-col items-center justify-center gap-0.5">
            <h1 className="text-h1 text-primary-50 whitespace-nowrap">말씀이 찾아오는 시간,</h1>
            <h1 className="text-h1 text-primary-50 whitespace-nowrap">톨리가 알려드릴게요!</h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5">
            <h2 className="text-h2 text-surface-200 whitespace-nowrap">
              매일 정해진 시간에 조용히 알려드려요.
            </h2>
            <h2 className="text-h2 text-surface-200 whitespace-nowrap">
              tolli가 배고프면 찾아가요.
            </h2>
          </div>
        </div>

        <div className="relative w-full max-w-64.5 aspect-square">
          <Image src={TimeTolly} fill alt="timeTolli" className="object-contain" />
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-[0.563rem]">
        <button
          type="button"
          onClick={requestAlarm}
          className="
              w-full max-w-[19.688rem] h-12 text-btn-lg
              text-bg bg-primary-75 rounded-[1.25rem] whitespace-nowrap
            "
        >
          알림 허용할래요
        </button>
        <div className="flex items-center">
          <button
            type="button"
            onClick={skipAlarm}
            className="flex w-full text-primary-75 text-no-alarm underline decoration-primary-75 cursor-pointer whitespace-nowrap"
          >
            나중에 설정할게요
          </button>
        </div>
      </div>
    </section>
  );
}
