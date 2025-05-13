'use client';

import { DashboardWrapper } from '@/modules/c-hub/interfaces/dashboard/components/dashboard-wrapper';
import { Suspense, useCallback } from 'react';

export default function DashboardPage() {
  // 手動刷新處理函數
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="p-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">任務與子任務總覽</h1>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          刷新資料
        </button>
      </div>
      <section className="mb-10">
        <Suspense fallback={<div className="text-center py-10">載入中...</div>}>
          <DashboardWrapper />
        </Suspense>
      </section>
    </div>
  );
}