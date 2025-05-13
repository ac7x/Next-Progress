'use server';

import { TaskInstance, TaskInstanceDomainService } from '@/modules/c-hub/domain/task-instance';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/repositories/task-instance-repository';

const taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);

/**
 * Query: 獲取單個任務實例
 */
export async function getTaskInstanceQuery(id: string): Promise<TaskInstance | null> {
    try {
        return await taskInstanceService.getTaskInstanceById(id);
    } catch (error) {
        console.error('獲取任務失敗:', error);
        return null;
    }
}

/**
 * Query: 獲取專案下所有任務實例
 */
export async function getTaskInstancesByProjectQuery(projectId: string): Promise<TaskInstance[]> {
    try {
        console.log('獲取任務查詢: projectId =', projectId);

        let tasks: TaskInstance[] = [];

        // 如果沒有提供專案 ID 或為空字符串，獲取所有任務
        if (!projectId || projectId.trim() === '') {
            console.log('獲取所有任務...');
            tasks = await taskInstanceService.getAllTaskInstances();
        } else {
            console.log('獲取特定專案任務...');
            tasks = await taskInstanceService.getTaskInstancesByProjectId(projectId);
        }

        console.log(`成功獲取 ${tasks.length} 個任務`);
        return tasks;
    } catch (error) {
        console.error('獲取專案任務列表失敗:', error);
        return [];
    }
}

/**
 * Query: 獲取工程下所有任務實例
 */
export async function getTaskInstancesByEngineeringQuery(engineeringId: string): Promise<TaskInstance[]> {
    try {
        return await taskInstanceService.getTaskInstancesByEngineeringId(engineeringId);
    } catch (error) {
        console.error('獲取工程任務列表失敗:', error);
        return [];
    }
}
