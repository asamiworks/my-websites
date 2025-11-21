import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WEBサイトとWEBアプリの違い | サービス比較 - AsamiWorks",
  description: "オリジナルサイト制作とWEBアプリ開発の違いを詳しく解説。お客様のニーズに合わせた最適なサービスをご提案します。",
  keywords: ["サービス比較", "WEBサイト", "WEBアプリ", "違い", "Web制作", "アプリ開発"],
  openGraph: {
    title: "WEBサイトとWEBアプリの違い | AsamiWorks",
    description: "オリジナルサイトとWEBアプリの違いを分かりやすく解説",
    url: "https://asami-works.com/services/comparison",
    siteName: "AsamiWorks",
    type: "website",
  },
  alternates: {
    canonical: "/services/comparison",
  },
};

export default function ComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
