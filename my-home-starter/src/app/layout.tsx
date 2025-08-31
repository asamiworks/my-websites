import { Inter } from "next/font/google";
import { ToastProvider } from "../contexts/ToastContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'マイホームスターター',
  description: '注文住宅で家を建てるならマイホームスターター',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ToastProvider>
         
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}