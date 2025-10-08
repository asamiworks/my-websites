'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChildForm } from '@/components/profile/ChildForm';
import { useChildren } from '@/hooks/useChildren';
import { Alert } from '@/components/ui';
import type { Child } from '@/types';

export default function EditChildPage() {
  const router = useRouter();
  const params = useParams();
  const { children, loading } = useChildren();
  const [child, setChild] = useState<Child | null>(null);
  const [error, setError] = useState<string | null>(null);

  const childId = params?.id as string;

  useEffect(() => {
    if (!loading && children.length > 0 && childId) {
      const foundChild = children.find(c => c.id === childId);
      if (foundChild) {
        setChild(foundChild);
      } else {
        setError('指定された子どもプロファイルが見つかりません');
      }
    }
  }, [children, loading, childId]);

  const handleSuccess = () => {
    // 編集成功後は一覧ページに戻る
    router.push('/children');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-gray-600 mt-4">プロファイルを読み込み中...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Alert className="text-red-800 bg-red-50 border-red-200">
            {error}
          </Alert>
          <div className="text-center">
            <button
              onClick={() => router.push('/children')}
              className="text-yellow-600 hover:text-yellow-700 underline"
            >
              子どもプロファイル一覧に戻る
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!child) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-8">
            <p className="text-gray-600">プロファイルが見つかりません</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {child.nickname}のプロファイル編集
          </h1>
          <p className="text-gray-600 mt-1">
            プロファイル情報を編集できます
          </p>
        </div>

        <ChildForm
          mode="edit"
          child={child}
          onSuccess={handleSuccess}
        />
      </div>
    </DashboardLayout>
  );
}