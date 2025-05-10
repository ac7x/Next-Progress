'use server';

import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/task-instance-repository';

// 其他現有的 Server Actions...

/**
 * 根據專案ID獲取該專案下的所有任務實體
 * 若 projectId 為空，則查詢所有任務（for dashboard）
 */
export async function listTaskInstancesByProject(projectId: string): Promise<TaskInstance[]> {
  try {
    // 若未指定 projectId，查詢全部
    if (!projectId?.trim()) {
      // 查詢全部任務
      return await taskInstanceRepository.list();
    }
    const taskInstances = await taskInstanceRepository.findByProjectId(projectId);
    return taskInstances;
  } catch (error) {
    console.error('獲取專案任務列表失敗:', error);
    return [];
  }
}

