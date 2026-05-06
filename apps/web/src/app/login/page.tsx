import Link from "next/link";

export default function page() {
  const OAUTH_REQUEST_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;

  return (
    <>
      <Link href={`${OAUTH_REQUEST_URL}`}>카카오로 시작하기</Link>
    </>
  );
}
