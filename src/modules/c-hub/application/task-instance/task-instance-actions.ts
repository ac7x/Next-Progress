'use server';

/**
 * @deprecated 使用 CQRS 模式下的 task-instance.command.ts 和 task-instance.query.ts 代替
 * 保留此文件僅為向後兼容。
 */

import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { getTaskInstancesByProjectQuery } from './task-instance.query';

/**
 * 根據專案ID獲取該專案下的所有任務實體
 * @deprecated 使用 getTaskInstancesByProjectQuery 代替
 */
export async function listTaskInstancesByProject(projectId: string): Promise<TaskInstance[]> {
  return getTaskInstancesByProjectQuery(projectId);
}

