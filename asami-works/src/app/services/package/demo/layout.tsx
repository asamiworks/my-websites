import { Metadata } from "next";

// デモページ共通のメタデータ
export const metadata: Metadata = {
  title: "LPデモ - パッケージプラン",
  description: "AsamiWorksのパッケージプラン（LP制作5万円〜）のデモページです。店舗名、業種、デザインテーマを選んで、あなたのお店のホームページをシミュレーションできます。",
  robots: {
    index: false, // デモページはインデックスしない
    follow: false,
  },
};

export default function DemoLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      {children}
    </>
  );
}