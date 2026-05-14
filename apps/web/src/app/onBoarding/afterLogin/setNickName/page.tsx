"use client";

import StandingTolli_1 from "../../../../../public/images/onBoarding/standingTolli_1.svg";
import Image from "next/image";
import Form from "next/form";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleSubmit = () => {
    console.log("서버로 닉네임 전송");
    if (state) {
      router.push(`/onBoarding/afterLogin/greeting/${name}`);
    }
  };

  return (
    <section className="flex flex-col w-full min-h-[100dvh] justify-between items-center px-[2.688rem] py-[5.313rem]">
      <div className="flex flex-col items-center w-full mt-[clamp(1rem,4dvh,10.25rem)]">
        <div className="flex flex-col items-center justify-center w-full gap-[0.125rem]">
          <h1 className="text-h1 text-primary-50">당신의 tolli,</h1>
          <h1 className="text-h1 text-primary-50">이름이 뭐예요?</h1>
          <h2 className="text-h2 text-surface-200">
            tolli에게 불러줄 닉네임을 지어주세요!
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

      <Form
        action={handleSubmit}
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

        <div className="flex flex-col items-center w-full">
          <button
            type="submit"
            className="
              w-full max-w-[19.688rem] h-[3rem] text-btn-lg 
              text-primary-75 bg-surface-500 rounded-[1.25rem]
            "
            disabled={!state}
          >
            닉네임 설정 완료
          </button>
        </div>
      </Form>
    </section>
  );
}
