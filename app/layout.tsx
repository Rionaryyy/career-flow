import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans", // 変数名はそのままでOK
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono", // 同様に維持
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "通信キャリア診断 | career-flow",
  description: "あなたに最適な通信キャリア・プランを提案します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
