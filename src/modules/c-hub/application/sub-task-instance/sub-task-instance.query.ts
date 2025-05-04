'use server';

import { SubTaskInstance, isValidSubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { SubTaskInstanceDomainService } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-service';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/sub-task-instance-repository';

const subTaskInstanceService = new SubTaskInstanceDomainService(subTaskInstanceRepository);

// Query: 取得單一子任務
export async function getSubTaskInstanceQuery(id: string): Promise<SubTaskInstance | null> {
    try {
        return await subTaskInstanceService.getSubTaskInstanceById(id);
    } catch (error) {
        console.error('獲取子任務失敗:', error);
        return null;
    }
}

// Query: 依任務ID查詢子任務
export async function listSubTasksInstanceByTaskIdQuery(taskId: string): Promise<SubTaskInstance[]> {
    try {
        const subTasks = await subTaskInstanceService.listSubTasksInstanceByTaskId(taskId);
        return subTasks.filter(isValidSubTaskInstance);
    } catch (error) {
        console.error('獲取任務的子任務列表失敗:', error);
        return [];
    }
}