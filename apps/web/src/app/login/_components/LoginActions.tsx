import LoginErrorMessage from "./LoginErrorMessage";
import LoginButton from "./LoginButton";

interface Props {
  error: string | null;
  requestKakaoLogin: () => void;
  requestGoogleLogin: () => void;
  requestAppleLogin: () => void;
}

export default function LoginActions({
  error,
  requestKakaoLogin,
  requestGoogleLogin,
  requestAppleLogin,
}: Props) {
  return (
    <div className="mt-auto w-full">
      <LoginErrorMessage error={error} />
      <LoginButton
        requestKakaoLogin={requestKakaoLogin}
        requestGoogleLogin={requestGoogleLogin}
        requestAppleLogin={requestAppleLogin}
      />
    </div>
  );
}
