import Image from "next/image";

const APP_STORE_URL = "https://apps.apple.com/kr/app/tolli/id6766518023";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.company.tolli";

function openStore() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  window.location.href = isIOS ? APP_STORE_URL : PLAY_STORE_URL;
}

export default function UpdateRequiredModal() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-between bg-[#1B1B1B] px-[clamp(1.25rem,6vw,2rem)] py-[clamp(2rem,6dvh,3rem)]">
      <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(1rem,4dvh,1.5rem)]">
        <p className="font-bold text-[#CCB5F0] text-[clamp(1.375rem,6vw,1.625rem)] leading-[1.3]">
          업데이트가 필요해요
        </p>
        <div className="flex flex-col items-center">
          <p className="text-[#ADADAD] text-[clamp(0.9375rem,4vw,1.0625rem)] leading-[1.55]">
            새로운 버전의 톨리가 나왔어요
          </p>
          <p className="text-[#ADADAD] text-[clamp(0.9375rem,4vw,1.0625rem)] leading-[1.55]">
            스토어에서 업데이트 후 이용해주세요
          </p>
        </div>
        <Image
          src="/tolli1.webp"
          alt="tolli"
          width={180}
          height={180}
          className="object-contain w-[clamp(7.5rem,40vw,11.25rem)] h-auto"
        />
      </div>

      <button
        type="button"
        onClick={openStore}
        className="w-full rounded-[1.25rem] bg-[#CCB5F0] py-[clamp(0.75rem,2dvh,0.875rem)] font-bold text-[#1B1B1B] text-[clamp(1rem,4.5vw,1.125rem)] leading-[1.3]"
      >
        업데이트 하러 가기
      </button>
    </div>
  );
}
