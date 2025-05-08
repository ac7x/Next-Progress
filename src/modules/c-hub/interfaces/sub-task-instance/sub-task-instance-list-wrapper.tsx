'use client';

// Query Concern: 只負責查詢與渲染子任務列表
import { useSubTaskInstancesByTaskInstance } from './hooks/use-sub-task-instance';
import { SubTaskInstanceList } from './components/sub-task-instance-list';

export function SubTaskInstanceListWrapper({ taskInstanceId }: { taskInstanceId: string }) {
  // React Query Hook，查詢子任務資料
  const { data = [], isLoading, error } = useSubTaskInstancesByTaskInstance(taskInstanceId);

  if (isLoading) return <div className="text-xs text-gray-400">載入子任務...</div>;
  if (error) return <div className="text-xs text-red-500">子任務載入失敗</div>;

  // 單一職責：渲染查詢結果
  return <SubTaskInstanceList subTaskInstances={data} />;
}

// 無需更動
export default SubTaskInstanceListWrapper;
