"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";

export function ConditionalHeader() {
  const pathname = usePathname();
  const isDemoPage = pathname?.includes('/demo/');
  const isMyPage = pathname?.startsWith('/mypage');
  return (isDemoPage || isMyPage) ? null : <Header />;
}

export function ConditionalBreadcrumb() {
  const pathname = usePathname();
  const isDemoPage = pathname?.includes('/demo/');
  const isMyPage = pathname?.startsWith('/mypage');
  return (isDemoPage || isMyPage) ? null : <Breadcrumb />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isDemoPage = pathname?.includes('/demo/');
  const isMyPage = pathname?.startsWith('/mypage');
  return (isDemoPage || isMyPage) ? null : <Footer />;
}

export function ConditionalMainStyle({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDemoPage = pathname?.includes('/demo/');
  const isMyPage = pathname?.startsWith('/mypage');

  return (
    <main style={{
      paddingTop: (isDemoPage || isMyPage) ? "0" : "70px",
      maxWidth: "100vw",
      overflowX: "hidden"
    }}>
      {children}
    </main>
  );
}