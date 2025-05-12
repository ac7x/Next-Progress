'use client';

import { TaskInstanceDashboard } from '@/modules/c-hub/interfaces/task-instance';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">任務與子任務總覽</h1>
      <section className="mb-10">
        <Suspense fallback={<div className="text-center py-10">載入中...</div>}>
          <TaskInstanceDashboard />
        </Suspense>
      </section>
    </div>
  );
}