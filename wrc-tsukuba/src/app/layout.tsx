export const metadata = {
  title: "WRC-Tsukuba | 日本最大級のラジコンサーキット場",
  description: "WRC-Tsukubaは龍ヶ崎にあるラジコンサーキット場です。初心者コースから上級者向けの様々なコースをご用意しています。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}


