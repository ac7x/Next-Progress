'use client';

import { listSubTasksInstanceByTaskIdQuery } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.query';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance';
import { useQuery } from '@tanstack/react-query';

/**
 * 根據父任務ID查詢所有子任務的鉤子函數
 * 使用 React Query 進行資料查詢與快取管理
 * @param taskInstanceId 父任務ID
 */
export function useSubTaskInstancesByTaskInstance(taskInstanceId: string) {
  return useQuery<SubTaskInstance[]>({
    queryKey: ['subTaskInstances', taskInstanceId],
    queryFn: () => listSubTasksInstanceByTaskIdQuery(taskInstanceId),
    enabled: !!taskInstanceId,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 25000, // 每25秒自動刷新
    staleTime: 10000, // 10秒後認為數據已過期
  });
}

/**
 * 根據子任務ID查詢單一子任務的鉤子函數
 * 使用現有 React Query 快取以優化性能
 * @param taskInstanceId 父任務ID
 * @param subTaskInstanceId 子任務ID
 */
export function useSubTaskInstanceById(taskInstanceId: string, subTaskInstanceId: string) {
  const { data: subTasks } = useSubTaskInstancesByTaskInstance(taskInstanceId);
  return subTasks?.find(subTask => subTask.id === subTaskInstanceId);
}
