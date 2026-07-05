export default function UpdateBanner() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-[#CCB5F0] text-black px-4 py-3 flex items-center justify-between">
      <span className="text-sm">새 버전이 나왔어요. 업데이트해주세요.</span>
      <button
        onClick={() =>
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "OPEN_STORE" }), // 네이티브가 스토어 URL 결정
          )
        }
        className="text-sm font-semibold underline"
      >
        업데이트
      </button>
    </div>
  );
}
