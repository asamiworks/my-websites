'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import type { Invoice } from '@/types/subscription';

export function InvoiceList() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Stripeから請求履歴を取得
    // 現在はモックデータで代用
    setTimeout(() => {
      const mockInvoices: Invoice[] = [
        {
          id: 'inv_1',
          userId: user?.uid || '',
          stripeInvoiceId: 'in_mock123',
          amount: 880,
          currency: 'jpy',
          status: 'paid',
          period: {
            start: new Date('2024-09-07'),
            end: new Date('2024-10-07'),
          },
          paidAt: new Date('2024-09-07'),
          dueDate: new Date('2024-09-07'),
          url: 'https://invoice.stripe.com/mock123',
          createdAt: new Date('2024-09-07'),
        },
        {
          id: 'inv_2',
          userId: user?.uid || '',
          stripeInvoiceId: 'in_mock456',
          amount: 880,
          currency: 'jpy',
          status: 'paid',
          period: {
            start: new Date('2024-08-07'),
            end: new Date('2024-09-07'),
          },
          paidAt: new Date('2024-08-07'),
          dueDate: new Date('2024-08-07'),
          url: 'https://invoice.stripe.com/mock456',
          createdAt: new Date('2024-08-07'),
        },
        {
          id: 'inv_3',
          userId: user?.uid || '',
          stripeInvoiceId: 'in_mock789',
          amount: 880,
          currency: 'jpy',
          status: 'paid',
          period: {
            start: new Date('2024-07-07'),
            end: new Date('2024-08-07'),
          },
          paidAt: new Date('2024-07-07'),
          dueDate: new Date('2024-07-07'),
          url: 'https://invoice.stripe.com/mock789',
          createdAt: new Date('2024-07-07'),
        },
      ];
      setInvoices(mockInvoices);
      setLoading(false);
    }, 500);
  }, [user]);

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return '支払い済み';
      case 'open':
        return '未払い';
      case 'draft':
        return '下書き';
      case 'void':
        return '無効';
      case 'uncollectible':
        return '回収不能';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'open':
        return 'text-orange-600 bg-orange-50';
      case 'draft':
        return 'text-gray-600 bg-gray-50';
      case 'void':
      case 'uncollectible':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-gray-600">請求履歴がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-gray-900">
                  {invoice.period.start.toLocaleDateString('ja-JP')} -{' '}
                  {invoice.period.end.toLocaleDateString('ja-JP')}
                </p>
                <p className="text-sm text-gray-500">
                  請求日: {invoice.createdAt.toLocaleDateString('ja-JP')}
                  {invoice.paidAt && (
                    <span className="ml-2">
                      支払日: {invoice.paidAt.toLocaleDateString('ja-JP')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-bold text-gray-900">
                ¥{invoice.amount.toLocaleString()}
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  invoice.status
                )}`}
              >
                {getStatusLabel(invoice.status)}
              </span>
            </div>

            {invoice.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(invoice.url, '_blank')}
              >
                領収書
              </Button>
            )}
          </div>
        </div>
      ))}

      {invoices.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            過去の請求履歴は{' '}
            <button
              onClick={() =>
                alert('Customer Portalで詳細な履歴をご確認いただけます')
              }
              className="text-blue-600 hover:text-blue-700 underline"
            >
              プラン管理
            </button>{' '}
            からご確認いただけます
          </p>
        </div>
      )}
    </div>
  );
}