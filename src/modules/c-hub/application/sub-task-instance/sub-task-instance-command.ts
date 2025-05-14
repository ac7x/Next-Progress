'use server';

import { CreateSubTaskInstanceProps, SubTaskInstance, SubTaskInstanceDomainService, SubTaskInstanceStatusType, UpdateSubTaskInstanceProps } from '@/modules/c-hub/domain/sub-task-instance';
import { TaskInstanceDomainService } from '@/modules/c-hub/domain/task-instance';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/repositories/sub-task-instance-repository';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/repositories/task-instance-repository';
import { revalidatePath } from 'next/cache';

const subTaskInstanceService = new SubTaskInstanceDomainService(subTaskInstanceRepository);

// Command: 建立子任務（必須帶上父任務 ID）
export async function createSubTaskInstanceCommand(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
        const subTaskInstance = await subTaskInstanceService.createSubTaskInstance(data);

        // 創建子任務後，更新父任務狀態
        if (data.parentTaskId) {
            const taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);
            await taskInstanceService.recalculateTaskStatus(data.parentTaskId);
        }

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
            const parentTask = await (new TaskInstanceDomainService(taskInstanceRepository)).getTaskInstanceById(subTaskInstance.taskId);
            if (parentTask?.projectId) {
                // 確保所有相關路徑都重新驗證，使客戶端數據保持最新
                revalidatePath(`/client/project/${parentTask.projectId}`);
                revalidatePath(`/client/dashboard_management`);
                // 確保實例管理頁面的所有相關路徑都重新驗證
                revalidatePath(`/client/instance_management`);
                revalidatePath(`/client/instance_management/page`);
                // 使用通配符驗證所有客戶端實例相關頁面
                revalidatePath('/client/instance_management/*');
                console.log(`已重新驗證所有相關頁面路徑，包括儀表板與實例管理`);
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
        const parentTaskId = subTaskInstance.parentTaskId;

        await subTaskInstanceService.deleteSubTaskInstance(id);

        // 如果有父任務，更新父任務狀態
        if (parentTaskId) {
            const taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);
            await taskInstanceService.recalculateTaskStatus(parentTaskId);
        }

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
export async function updateSubTaskInstanceStatusCommand(id: string, status: SubTaskInstanceStatusType): Promise<SubTaskInstance> {
    return updateSubTaskInstanceCommand(id, { status });
}

// Command: 更新完成率
export async function updateSubTaskInstanceCompletionCommand(id: string, completionRate: number): Promise<SubTaskInstance> {
    return updateSubTaskInstanceCommand(id, { completionRate });
}

// Command: 批量更新子任務實際設備數量並同步父任務
export async function batchUpdateSubTaskActualEquipmentCommand(
    updates: { id: string, actualEquipmentCount: number }[]
): Promise<void> {
    try {
        await subTaskInstanceService.batchUpdateActualEquipment(updates);

        // 由於已經在域服務層級同步了父任務，只需重新驗證相關頁面
        revalidatePath(`/client/dashboard_management`);
        revalidatePath(`/client/instance_management`);
        console.log(`已批量更新 ${updates.length} 個子任務的實際設備數量，並同步父任務狀態`);
    } catch (error) {
        console.error('批量更新子任務實際設備數量失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('批量更新子任務實際設備數量失敗: ' + String(error));
    }
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
    const parentTaskId = formData.get('parentTaskId')?.toString() || null;
    await createSubTaskInstanceCommand({
        // 名稱自動生成
        name: '', // 由 Domain Service 決定
        description,
        taskId,
        parentTaskId,
        // priority, // 預設 0
        // status,   // 預設 'TODO'
        plannedStart,
        equipmentCount
    });
}
