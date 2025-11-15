import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ローカル請求書システム",
  description: "ローカル請求書自動生成システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
