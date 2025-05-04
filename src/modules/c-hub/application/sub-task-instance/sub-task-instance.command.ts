'use server';

import { CreateSubTaskInstanceProps, SubTaskInstance, SubTaskInstanceStatus, UpdateSubTaskInstanceProps } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { SubTaskInstanceDomainService } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-service';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/sub-task-instance-repository';

const subTaskInstanceService = new SubTaskInstanceDomainService(subTaskInstanceRepository);

// Command: 建立子任務
export async function createSubTaskInstanceCommand(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
        const subTaskInstance = await subTaskInstanceService.createSubTaskInstance(data);
        return subTaskInstance;
    } catch (error) {
        console.error('建立子任務失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('建立子任務失敗: ' + String(error));
    }
}

// Command: 更新子任務
export async function updateSubTaskInstanceCommand(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
        const subTaskInstance = await subTaskInstanceService.updateSubTaskInstance(id, data);
        return subTaskInstance;
    } catch (error) {
        console.error('更新子任務失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('更新子任務失敗: ' + String(error));
    }
}

// Command: 刪除子任務
export async function deleteSubTaskInstanceCommand(id: string): Promise<{ id: string, taskId: string }> {
    try {
        // 先獲取子任務以返回相關資訊
        const subTaskInstance = await subTaskInstanceService.getSubTaskInstanceById(id);
        if (!subTaskInstance) {
            throw new Error('找不到要刪除的子任務');
        }

        const taskId = subTaskInstance.taskId;

        await subTaskInstanceService.deleteSubTaskInstance(id);

        // 返回已刪除的子任務ID和所屬任務ID，讓前端可以進行內聯更新
        return { id, taskId };
    } catch (error) {
        console.error('刪除子任務失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('刪除子任務失敗: ' + String(error));
    }
}

// Command: 更新狀態
export async function updateSubTaskInstanceStatusCommand(id: string, status: SubTaskInstanceStatus): Promise<SubTaskInstance> {
    return updateSubTaskInstanceCommand(id, { status });
}

// Command: 更新完成率
export async function updateSubTaskInstanceCompletionCommand(id: string, completionRate: number): Promise<SubTaskInstance> {
    return updateSubTaskInstanceCommand(id, { completionRate });
}