'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: '📊' },
  { href: '/children', label: '子どもプロファイル', icon: '👶' },
  { href: '/profile', label: 'プロフィール', icon: '👤' },
  { href: '/settings', label: '設定', icon: '⚙️' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-bold text-yellow-600">
                i-manabee
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.displayName || user?.email}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}