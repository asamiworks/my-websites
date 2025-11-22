import { Metadata } from "next";

export const metadata: Metadata = {
  title: "不動産賃貸管理システムデモ | WEBアプリ開発実績 - AsamiWorks",
  description: "物件・入居者・契約を一元管理する賃貸管理システムのデモ。見学予約カレンダー、家賃管理、修繕依頼管理など、不動産業務を効率化する機能を搭載したシステムをご覧ください。",
  keywords: ["WEBアプリ開発", "不動産管理システム", "賃貸管理", "物件管理", "入居者管理", "見学予約", "デモ"],
  openGraph: {
    title: "不動産賃貸管理システムデモ | WEBアプリ開発実績 - AsamiWorks",
    description: "物件・入居者・契約を一元管理する賃貸管理システムのデモ",
    url: "https://asami-works.com/services/webapp/rental-management",
    siteName: "AsamiWorks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "不動産賃貸管理システムデモ | WEBアプリ開発実績",
    description: "不動産業務を効率化するシステムのデモをご覧ください",
  },
  alternates: {
    canonical: "/services/webapp/rental-management",
  },
};

export default function RentalManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
