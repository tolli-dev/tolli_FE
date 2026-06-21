import ProviderButton from "./ProviderButton";

interface Props {
  requestKakaoLogin: () => void;
  requestGoogleLogin: () => void;
  requestAppleLogin: () => void;
}

export default function LoginButton({
  requestKakaoLogin,
  requestGoogleLogin,
  requestAppleLogin,
}: Props) {
  return (
    <div
      className="flex flex-col justify-center px-10.75 items-center gap-2.75 w-full"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <ProviderButton provider="kakao" onClick={requestKakaoLogin} />
      <ProviderButton provider="google" onClick={requestGoogleLogin} />
      <ProviderButton provider="apple" onClick={requestAppleLogin} />
    </div>
  );
}
