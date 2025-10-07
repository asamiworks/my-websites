import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'i-manabee - 学習ダッシュボード',
  description: 'まなびーの学習管理システム',
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}