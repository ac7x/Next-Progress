'use client';

import { getTaskInstancesByProjectQuery } from '@/modules/c-hub/application/task-instance/task-instance.query';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { TaskInstanceSubTaskInstancesSection } from '@/modules/c-hub/interfaces/task-instance';
import { TaskInstanceSummaryCard } from '@/modules/c-hub/interfaces/task-instance/components/task-instance-summary-card';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

export default function DashboardPage() {
  // 預設查詢全部任務，可依需求傳入 projectId
  const projectId = '';
  const { data: tasks = [], isLoading, error } = useQuery<TaskInstance[]>({
    queryKey: ['taskInstances', projectId],
    queryFn: () => getTaskInstancesByProjectQuery(projectId),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>無法載入任務資料，請稍後再試</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">任務與子任務總覽</h1>
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">所有任務</h2>
          <span className="text-gray-500 text-sm">共 {tasks.length} 項</span>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-3">目前沒有任務</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {[...tasks]
              .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
              .map((task) => (
                <div key={task.id} className="space-y-2">
                  {/* 顯示優先級 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-12">優先級: {task.priority ?? 0}</span>
                    <div className="flex-1">
                      <TaskInstanceSummaryCard taskInstance={task} />
                    </div>
                  </div>
                  <Suspense fallback={null}>
                    <TaskInstanceSubTaskInstancesSection taskInstanceId={task.id} />
                  </Suspense>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}