import { Metadata } from "next";

export const metadata: Metadata = {
  title: "厩舎管理システムデモ | WEBアプリ開発実績 - AsamiWorks",
  description: "実際の競走馬厩舎管理システムを参考にした、本格的なビジネスアプリケーションのデモ。データ管理、請求書生成、PDF出力など、複雑なビジネスロジックを実装したシステムをご覧ください。",
  keywords: ["WEBアプリ開発", "業務システム", "厩舎管理", "請求書管理", "データ管理", "デモ"],
  openGraph: {
    title: "厩舎管理システムデモ | WEBアプリ開発実績 - AsamiWorks",
    description: "実際の競走馬厩舎管理システムを参考にした、本格的なビジネスアプリケーションのデモ",
    url: "https://asami-works.com/services/webapp/stable-management",
    siteName: "AsamiWorks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "厩舎管理システムデモ | WEBアプリ開発実績",
    description: "本格的なビジネスアプリケーションのデモをご覧ください",
  },
  alternates: {
    canonical: "/services/webapp/stable-management",
  },
};

export default function StableManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
