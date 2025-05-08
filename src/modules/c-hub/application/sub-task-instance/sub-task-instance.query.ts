'use server';

import { SubTaskInstance, isValidSubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { SubTaskInstanceDomainService } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-service';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/sub-task-instance-repository';

const subTaskInstanceService = new SubTaskInstanceDomainService(subTaskInstanceRepository);

// Query: 依任務ID查詢子任務（必須帶上父任務 ID）
export async function listSubTasksInstanceByTaskIdQuery(taskId: string): Promise<SubTaskInstance[]> {
    try {
        const subTasks = await subTaskInstanceService.listSubTasksInstanceByTaskId(taskId);
        return subTasks.filter(isValidSubTaskInstance);
    } catch (error) {
        console.error('獲取任務的子任務列表失敗:', error);
        return [];
    }
}