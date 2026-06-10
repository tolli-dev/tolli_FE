"use client";

import StandingTolli_1 from "../../../../public/images/onBoarding/standingTolli_1.webp";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";
import { fireAuth } from "@/firebase/fireAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const getValidationResult = (name: string) => {
  const blankRegex = /\s/g;
  const specialWordRegex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g;

  if (name.length === 0) return { state: false, message: "" };
  if (name.length > 0 && name.length < 2)
    return { state: false, message: "2글자 이상으로 입력해주세요." };
  if (name.length > 10)
    return { state: false, message: "10글자 이하로 입력해주세요." };
  if (blankRegex.test(name))
    return { state: false, message: "공백을 제거해주세요." };
  if (specialWordRegex.test(name))
    return { state: false, message: "특수 문자를 제거해주세요." };
  return { state: true, message: "사용 가능한 닉네임이에요." };
};

export default function Page() {
  const [name, setName] = useState("");
  const { state, message } = getValidationResult(name);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!state) return;
    setLoading(true);
    setError(null);
    try {
      const termsAgreedAt = sessionStorage.getItem("termsAgreedAt") ?? "";
      const privacyAgreedAt = sessionStorage.getItem("privacyAgreedAt") ?? "";
      const emailMarketingAgreed =
        sessionStorage.getItem("emailMarketingAgreed") === "true";
      const emailMarketingAgreedAt =
        sessionStorage.getItem("emailMarketingAgreedAt") || null;

      await createUser(dataConnect, {
        nickname: name,
        termsAgreedAt,
        privacyAgreedAt,
        emailMarketingAgreed,
        emailMarketingAgreedAt,
      });

      sessionStorage.removeItem("termsAgreedAt");
      sessionStorage.removeItem("privacyAgreedAt");
      sessionStorage.removeItem("emailMarketingAgreed");
      sessionStorage.removeItem("emailMarketingAgreedAt");

      const idToken = await fireAuth.currentUser?.getIdToken();
      if (idToken) {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      }

      router.push(`/afterLogin/greeting/${name}`);
    } catch {
      setError("닉네임 설정에 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50">
          <LoadingSpinner />
        </div>
      )}

      <div className="flex flex-col items-center w-full mt-[clamp(1rem,4dvh,10.25rem)]">
        <div className="flex flex-col items-center justify-center w-full gap-[0.125rem]">
          <h1 className="text-h1 text-primary-50 whitespace-nowrap">
            tolli가 어떻게
          </h1>
          <h1 className="text-h1 text-primary-50 whitespace-nowrap">
            불러드리면 좋을까요?
          </h1>
          <h2 className="text-h2 text-surface-200 whitespace-nowrap">
            앞으로 tolli가 불러드릴 이름을 입력해주세요.
          </h2>
        </div>
        <div className="relative w-full max-w-[16.125rem] aspect-square">
          <Image
            src={StandingTolli_1}
            fill
            alt="hungryTolli"
            className="object-contain"
          />
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="flex flex-col items-center flex-1 w-full justify-between mt-[clamp(1rem,2dvh,2.938rem)] gap-[1rem]"
      >
        <div className="flex flex-col w-full items-center">
          <input
            type="text"
            value={name}
            placeholder="닉네임을 입력해주세요"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[3rem] bg-surface-350/20 backdrop-blur-xl pl-[1rem] rounded-[0.3rem] input-caption text-primary-75 mb-[0.5rem]"
          />
          <div className="flex-start w-full">
            <span className="text-b2 text-primary-75">{message}</span>
          </div>
        </div>

        <div className="flex flex-col items-center w-full gap-2">
          {error && (
            <p className="text-red-400 text-[0.8125rem] text-center">{error}</p>
          )}
          <button
            type="submit"
            className="
              w-full max-w-[19.688rem] h-[3rem] text-btn-lg 
              text-primary-75 bg-surface-500 rounded-[1.25rem] whitespace-nowrap
            "
            disabled={!state}
          >
            닉네임 설정 완료
          </button>
        </div>
      </form>
    </section>
  );
}
