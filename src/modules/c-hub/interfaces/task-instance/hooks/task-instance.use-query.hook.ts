'use client';

import { getTaskInstanceQuery, getTaskInstancesByProjectQuery } from '@/modules/c-hub/application/task-instance/task-instance-query';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { useQuery } from '@tanstack/react-query';

/**
 * 根據專案ID查詢任務的鉤子函數
 * 使用 React Query 進行資料查詢與快取管理
 * @param projectId 專案ID，若為空字串則查詢全部任務
 */
export function useTaskInstancesByProject(projectId?: string) {
    return useQuery<TaskInstance[]>({
        queryKey: ['taskInstances', projectId],
        queryFn: () => getTaskInstancesByProjectQuery(projectId || ''),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

/**
 * 根據任務ID查詢單一任務的鉤子函數
 * @param taskInstanceId 任務ID
 */
export function useTaskInstanceById(taskInstanceId: string) {
    return useQuery<TaskInstance | null>({
        queryKey: ['taskInstance', taskInstanceId],
        queryFn: () => getTaskInstanceQuery(taskInstanceId),
        enabled: !!taskInstanceId,
    });
}
