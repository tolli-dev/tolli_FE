import { KakaoIcon, GoogleIcon, AppleIcon } from "./icons";

const PROVIDER_CONFIG = {
  kakao: {
    bgColor: "bg-[#FEE500]",
    textColor: "text-[#000000]",
    icon: <KakaoIcon />,
    label: "카카오로 로그인",
  },
  google: {
    bgColor: "bg-white",
    textColor: "text-[#1f1f1f]",
    icon: <GoogleIcon />,
    label: "Sign in with Google",
  },
  apple: {
    bgColor: "bg-black",
    textColor: "text-white",
    icon: <AppleIcon />,
    label: "Sign in with Apple",
  },
} as const;

type Provider = keyof typeof PROVIDER_CONFIG;

interface Props {
  provider: Provider;
  onClick: () => void;
}

export default function ProviderButton({ provider, onClick }: Props) {
  const { bgColor, textColor, icon, label } = PROVIDER_CONFIG[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-13.5 flex items-center justify-center gap-3 ${bgColor} rounded-[20px]`}
    >
      {icon}
      <span className={`${textColor} text-[14px] font-medium`}>{label}</span>
    </button>
  );
}
