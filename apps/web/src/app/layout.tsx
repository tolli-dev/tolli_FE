import type { Metadata, Viewport } from "next"; // Viewport 타입 추가
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../../../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "tolli",
  description: "성경 암송 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body
        className="
          min-h-full flex flex-col
          pt-[env(safe-area-inset-top)]
          pb-[env(safe-area-inset-bottom)]
          pl-[env(safe-area-inset-left)]
          pr-[env(safe-area-inset-right)]
        "
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
