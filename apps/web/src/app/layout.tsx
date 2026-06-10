import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import SoundPreloader from "@/components/SoundPreloader";

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  weight: ['400', '700'],
});

const pretendard = localFont({
  src: '../../../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'tolli',
  description: '성경 암송 앱',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${notoSansKR.variable} h-full antialiased`}>
      <body
        className="h-full"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <SoundPreloader />
        {children}
      </body>
    </html>
  );
}
