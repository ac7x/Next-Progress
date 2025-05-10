'use server';

import { TaskInstance, UpdateTaskInstanceProps } from '@/modules/c-hub/domain/task-instance';
import { TaskInstanceDomainService } from '@/modules/c-hub/domain/task-instance';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/task-instance-repository';
import { revalidatePath } from 'next/cache';

const taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);

// Command: 更新任務實例
export async function updateTaskInstanceCommand(
    id: string,
    data: UpdateTaskInstanceProps
): Promise<TaskInstance> {
    try {
        if (!id?.trim()) {
            throw new Error('任務ID不能為空');
        }

        const taskInstance = await taskInstanceService.updateTaskInstance(id, data);

        // 重新驗證相關頁面
        if (taskInstance.projectId) {
            revalidatePath(`/client/project/${taskInstance.projectId}`);
        }

        return taskInstance;
    } catch (error) {
        console.error('更新任務失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('更新任務失敗: ' + String(error));
    }
}

// Command: 更新任務設備數量
export async function updateTaskInstanceEquipmentCountCommand(
    id: string,
    count: number
): Promise<TaskInstance> {
    return updateTaskInstanceCommand(id, { actualEquipmentCount: count });
}

// 新增：專責優先級調整命令（CQRS Command Concern）
export async function updateTaskInstancePriorityCommand(
    id: string,
    priority: number
): Promise<TaskInstance> {
    return updateTaskInstanceCommand(id, { priority });
}