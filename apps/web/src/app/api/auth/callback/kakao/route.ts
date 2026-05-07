import { IP_URL } from "@/constants/url";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authCode = searchParams.get("code");
  const cookieStore = await cookies();

  if (!authCode) {
    return NextResponse.redirect(new URL(`${IP_URL}/login`, request.url));
  }

  const paramData = new URLSearchParams();
  paramData.append("grant_type", "authorization_code");
  paramData.append(
    "client_id",
    `${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
  );
  paramData.append(
    "redirect_uri",
    `${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`,
  );
  paramData.append("code", authCode);
  paramData.append(
    "client_secret",
    `${process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET_ID_KEY}`,
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

    cookieStore.set("token", tokenData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.redirect(
      new URL(`${IP_URL}/api/auth/success`, request.url),
    );
  } catch (error) {
    console.error("Error", error);
    return NextResponse.redirect(new URL(`${IP_URL}/login`, request.url));
  }
}
