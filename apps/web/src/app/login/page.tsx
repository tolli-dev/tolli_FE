import { useIsReactNativeWebview } from "../hooks/useIsReactNativeWebview ";

export default function page() {
  const isWebView = useIsReactNativeWebview();

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;

    if (isWebView) {
      const message = JSON.stringify({
        type: "KAKAO_LOGIN",
        url: KAKAO_AUTH_URL,
      });
      window?.ReactNativeWebView.postMessage(message);
    } else {
      window.location.href = KAKAO_AUTH_URL;
    }
  };

  return (
    <>
      <button onClick={handleKakaoLogin}>카카오톡으로 시작하기</button>
    </>
  );
}
