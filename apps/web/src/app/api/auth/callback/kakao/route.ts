import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authCode = searchParams.get("code");

  if (!authCode) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const paramData = new URLSearchParams();
  paramData.append("grant_type", "authorization_code");
  paramData.append("client_id", `${process.env.KAKAO_REST_API_KEY}`);
  paramData.append("redirect_uri", `${process.env.KAKAO_REDIRECT_URI}`);
  paramData.append("code", authCode);
  paramData.append(
    "client_secret",
    `${process.env.KAKAO_CLIENT_SECRET_ID_KEY}`,
  );

  try {
    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: paramData,
    });

    if (!tokenResponse.ok)
      throw new Error(`HTTP Error: ${tokenResponse.status}`);

    const tokenData = await tokenResponse.json();

    console.log(tokenData);
    return NextResponse.redirect(new URL("/main", request.url));
  } catch (error) {
    console.error("Error", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
