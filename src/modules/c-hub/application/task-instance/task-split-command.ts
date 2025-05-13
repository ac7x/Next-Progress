'use server';

import { CreateSubTaskInstanceProps, SubTaskInstance, SubTaskInstanceDomainService } from '@/modules/c-hub/domain/sub-task-instance';
import { TaskInstanceDomainService } from '@/modules/c-hub/domain/task-instance';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/repositories/sub-task-instance-repository';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/repositories/task-instance-repository';
import { revalidatePath } from 'next/cache';

// 命令層單例
const subTaskInstanceService = new SubTaskInstanceDomainService(subTaskInstanceRepository);
const taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);

/**
 * 任務分割子任務命令
 * 依據 DDD 與 CQRS 架構設計，處理任務分割子任務的業務邏輯
 * 
 * @param taskId 父任務ID
 * @param subTaskData 子任務數據
 * @returns 創建的子任務實體
 */
export async function taskSplitSubtaskCommand(
    taskId: string,
    subTaskData: Omit<CreateSubTaskInstanceProps, 'taskId'>
): Promise<SubTaskInstance> {
    try {
        // 1. 獲取父任務的信息，進行業務驗證
        const parentTask = await taskInstanceService.getTaskInstanceById(taskId);
        if (!parentTask) {
            throw new Error(`找不到ID為 ${taskId} 的任務`);
        }

        // 2. 設置默認名稱（如果沒有提供）
        const name = subTaskData.name?.trim() || `${parentTask.name} - 子任務`;

        // 3. 驗證設備數量邏輯
        const parentEquipmentCount = parentTask.equipmentCount || 0;

        // 獲取現有子任務
        const existingSubTasks = await subTaskInstanceRepository.findByTaskId(taskId);

        // 計算已分配的設備數量
        const allocatedEquipment = existingSubTasks.reduce(
            (total, subTask) => total + (subTask.equipmentCount || 0),
            0
        );

        // 計算已使用的設備數量
        const usedEquipment = existingSubTasks.reduce(
            (total, subTask) => total + (subTask.actualEquipmentCount || 0),
            0
        );

        // 計算剩餘可分配設備數量
        const remainingEquipment = parentEquipmentCount - allocatedEquipment;

        // 1. 如果子任務指定了設備數量，檢查是否超過父任務的可用數量
        if (subTaskData.equipmentCount !== undefined && subTaskData.equipmentCount !== null) {
            if (subTaskData.equipmentCount > remainingEquipment) {
                throw new Error(`子任務設備數量 ${subTaskData.equipmentCount} 超過了父任務剩餘可分配數量 ${remainingEquipment}`);
            }
        }

        // 2. 如果子任務指定了實際設備數量，檢查是否合理
        if (subTaskData.actualEquipmentCount !== undefined && subTaskData.actualEquipmentCount !== null) {
            if (subTaskData.equipmentCount !== undefined && subTaskData.equipmentCount !== null &&
                subTaskData.actualEquipmentCount > subTaskData.equipmentCount) {
                throw new Error(`子任務實際設備數量 ${subTaskData.actualEquipmentCount} 超過了計劃設備數量 ${subTaskData.equipmentCount}`);
            }
        }

        // 4. 構建完整的子任務數據
        const fullSubTaskData: CreateSubTaskInstanceProps = {
            name,
            description: subTaskData.description,
            plannedStart: subTaskData.plannedStart,
            plannedEnd: subTaskData.plannedEnd,
            equipmentCount: subTaskData.equipmentCount,
            actualEquipmentCount: subTaskData.actualEquipmentCount ?? 0,
            priority: subTaskData.priority ?? parentTask.priority,
            status: subTaskData.status || 'TODO',
            completionRate: subTaskData.completionRate ?? 0,
            taskId,
            parentTaskId: taskId // 確保父任務ID正確設置
        };

        // 5. 創建子任務
        const createdSubTask = await subTaskInstanceService.createSubTaskInstance(fullSubTaskData);

        // 6. 重新計算並更新父任務狀態
        await taskInstanceService.recalculateTaskStatus(taskId);

        // 7. 重新驗證相關路徑
        if (parentTask.projectId) {
            revalidatePath(`/client/dashboard_management`);
            revalidatePath(`/client/project/${parentTask.projectId}`);
        }

        return createdSubTask;
    } catch (error) {
        console.error('任務分割子任務失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('任務分割子任務失敗: ' + String(error));
    }
}

/**
 * 從表單數據創建子任務的 Server Action
 * 用於處理從表單提交的數據
 * 
 * @param formData 表單數據
 * @returns 創建的子任務實體
 */
export async function taskSplitSubtaskFormAction(formData: FormData): Promise<SubTaskInstance> {
    const taskId = formData.get('taskId')?.toString() || '';
    const name = formData.get('name')?.toString() || '';
    const description = formData.get('description')?.toString() || null;
    const plannedStartRaw = formData.get('plannedStart')?.toString() || null;
    const plannedEndRaw = formData.get('plannedEnd')?.toString() || null;
    const equipmentCountRaw = formData.get('equipmentCount')?.toString() || null;

    const plannedStart = plannedStartRaw ? new Date(plannedStartRaw) : null;
    const plannedEnd = plannedEndRaw ? new Date(plannedEndRaw) : null;
    const equipmentCount = equipmentCountRaw ? Number(equipmentCountRaw) : null;

    return await taskSplitSubtaskCommand(taskId, {
        name,
        description,
        plannedStart,
        plannedEnd,
        equipmentCount,
        actualEquipmentCount: 0 // 新分割的子任務，實際使用數量默認為 0
    });
}
