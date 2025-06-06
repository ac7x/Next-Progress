'use server';

import { TaskInstance, TaskInstanceDomainService, UpdateTaskInstanceProps } from '@/modules/c-hub/domain/task-instance';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/repositories/task-instance-repository';
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
            revalidatePath(`/client/dashboard_management`);
            // 確保實例管理頁面的所有相關路徑都重新驗證
            revalidatePath(`/client/instance_management`);
            revalidatePath(`/client/instance_management/page`);
            // 使用通配符驗證所有客戶端實例相關頁面
            revalidatePath('/client/instance_management/*');
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