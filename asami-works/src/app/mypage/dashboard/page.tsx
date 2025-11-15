'use client';

import { Suspense } from 'react';
import DashboardContent from './DashboardContent';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default function MyPageDashboard() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
