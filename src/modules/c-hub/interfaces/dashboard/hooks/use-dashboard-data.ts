'use client';

import { getTaskInstancesByProjectQuery } from '@/modules/c-hub/application/task-instance/task-instance-query';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { useQuery } from '@tanstack/react-query';

/**
 * 儀表板資料 Hook
 * 集中管理儀表板所需的各種查詢
 */
export function useDashboardData() {
    // 查詢所有任務
    const {
        data: tasks = [],
        isLoading: isTasksLoading,
        error: tasksError
    } = useQuery<TaskInstance[]>({
        queryKey: ['allTasks'],
        queryFn: () => getTaskInstancesByProjectQuery(''), // 空字串表示獲取所有任務
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    // 返回整合後的資料
    return {
        tasks,
        isLoading: isTasksLoading,
        error: tasksError
    };
}
