import Image from "next/image";

// 스토어 앱을 직접 여는 네이티브 스킴.
// react-native-webview 기본 originWhitelist(http/https)에 안 걸려 OS가
// 스토어 앱으로 연다. (https 링크는 웹뷰 안에서 열려버림)
const APP_STORE_URL = "itms-apps://apps.apple.com/kr/app/tolli/id6766518023";
const PLAY_STORE_URL = "market://details?id=com.company.tolli";

// 구버전 네이티브에는 OPEN_STORE 핸들러가 없어 postMessage에 의존할 수 없으므로
// 웹에서 스토어 스킴으로 바로 연다.
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
