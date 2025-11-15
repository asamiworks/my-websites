import { Metadata, Viewport } from "next";
import "./globals.css";
import {
  ConditionalHeader,
  ConditionalFooter,
  ConditionalBreadcrumb,
  ConditionalMainStyle
} from "../components/ConditionalLayout";
import ChatWidget from "../components/ChatWidget";
import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: {
    default: "AsamiWorks｜茨城・千葉の補助金対応ホームページ制作",
    template: "%s | AsamiWorks"
  },
  description: "成果につながるホームページ制作 - 地域密着型Web制作サービス。小規模事業者持続化補助金対応で最大66.7%の費用削減。",
  keywords: ["ホームページ制作", "Web制作", "茨城県", "千葉県", "補助金対応", "小規模事業者持続化補助金"],
  authors: [{ name: "AsamiWorks" }],
  creator: "AsamiWorks",
  publisher: "AsamiWorks",
  metadataBase: new URL("https://asami-works.com"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://asami-works.com",
    siteName: "AsamiWorks",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AsamiWorks - 補助金対応ホームページ制作",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-card.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://asami-works.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#007bff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <ConditionalHeader />
          <ConditionalMainStyle>
            <ConditionalBreadcrumb />
            {children}
          </ConditionalMainStyle>
          <ConditionalFooter />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}