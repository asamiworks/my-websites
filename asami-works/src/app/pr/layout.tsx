import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false, // PRページは基本的にnoindex
    follow: false,
  },
};

export default function PRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* PR専用のシンプルなレイアウト */}
      {children}
    </>
  );
}
