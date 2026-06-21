import ProviderButton from "./ProviderButton";

type Provider = "kakao" | "google" | "apple";

interface Props {
  requestLogin: (provider: Provider) => void;
}

export default function LoginButton({ requestLogin }: Props) {
  return (
    <div
      className="flex flex-col justify-center px-10.75 items-center gap-2.75 w-full"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <ProviderButton provider="kakao" onClick={() => requestLogin("kakao")} />
      <ProviderButton
        provider="google"
        onClick={() => requestLogin("google")}
      />
      <ProviderButton provider="apple" onClick={() => requestLogin("apple")} />
    </div>
  );
}
