export default function UpdateRequiredModal() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[#1B1B1B] px-8 text-center">
      <p className="text-[#CCB5F0] text-xl font-semibold">업데이트가 필요해요</p>
      <p className="text-[#ADADAD] text-sm leading-6">
        새로운 버전의 톨리가 나왔어요.
        <br />
        스토어에서 업데이트 후 이용해주세요.
      </p>
      <button
        type="button"
        onClick={() =>
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "OPEN_STORE" }), // 네이티브가 스토어 URL 결정
          )
        }
        className="w-full max-w-xs h-12 rounded-2xl bg-[#CCB5F0] text-black font-semibold"
      >
        업데이트 하러 가기
      </button>
    </div>
  );
}
