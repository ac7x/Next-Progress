'use server';

import { TaskInstance } from '@/modules/c-hub/domain/task-instance/task-instance-entity';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/task-instance-repository';

// 其他現有的 Server Actions...

/**
 * 根據專案ID獲取該專案下的所有任務實體
 */
export async function listTaskInstancesByProject(projectId: string): Promise<TaskInstance[]> {
  try {
    if (!projectId?.trim()) {
      throw new Error('專案ID不能為空');
    }
    const taskInstances = await taskInstanceRepository.findByProjectId(projectId);
    return taskInstances;
  } catch (error) {
    console.error('獲取專案任務列表失敗:', error);
    return [];
  }
}

