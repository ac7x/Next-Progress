'use server';

import { CreateSubTaskInstanceProps, SubTaskInstance, SubTaskInstanceStatus, UpdateSubTaskInstanceProps } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { SubTaskInstanceDomainService } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-service';
import { TaskInstanceDomainService } from '@/modules/c-hub/domain/task-instance/task-instance-service';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/sub-task-instance-repository';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/task-instance-repository';
import { revalidatePath } from 'next/cache';

const subTaskInstanceService = new SubTaskInstanceDomainService(subTaskInstanceRepository);

// Command: 建立子任務（必須帶上父任務 ID）
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

// Command: 更新子任務（必須帶上父任務 ID，自動同步父任務聚合根）
export async function updateSubTaskInstanceCommand(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
        const subTaskInstance = await subTaskInstanceService.updateSubTaskInstance(id, data);
        // 重新驗證專案頁面（聚合根同步後，父任務狀態已更新）
        if (subTaskInstance.taskId) {
            const taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);
            const parentTask = await taskInstanceService.getById(subTaskInstance.taskId);
            if (parentTask?.projectId) {
                revalidatePath(`/client/project/${parentTask.projectId}`);
            }
        }
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

// Server Action: 處理表單提交（for Client Component）
export async function createSubTaskInstanceFormAction(formData: FormData): Promise<void> {
    // 名稱由後端自動生成
    // const name = formData.get('name')?.toString() || '';
    const description = formData.get('description')?.toString() || null;
    // const priority = Number(formData.get('priority'));
    // const status = formData.get('status')?.toString() as any;
    const plannedStartRaw = formData.get('plannedStart')?.toString() || null;
    const plannedStart = plannedStartRaw ? new Date(plannedStartRaw) : null;
    const equipmentCountRaw = formData.get('equipmentCount')?.toString() || null;
    const equipmentCount = equipmentCountRaw ? Number(equipmentCountRaw) : null;
    const taskId = formData.get('taskInstanceId')?.toString() || '';
    await createSubTaskInstanceCommand({
        // 名稱自動生成
        name: '', // 由 Domain Service 決定
        description,
        taskId,
        // priority, // 預設 0
        // status,   // 預設 'TODO'
        plannedStart,
        equipmentCount
    });
}