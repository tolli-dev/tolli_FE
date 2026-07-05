import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      minVersion: {
        ios: process.env.MIN_APP_VERSION_IOS ?? "1.0.0",
        android: process.env.MIN_APP_VERSION_ANDROID ?? "1.0.0",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
