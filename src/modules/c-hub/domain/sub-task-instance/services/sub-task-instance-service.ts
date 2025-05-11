import { TaskInstanceDomainService } from '@/modules/c-hub/domain/task-instance';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/repositories/task-instance-repository';
import { CreateSubTaskInstanceProps, SubTaskInstance, UpdateSubTaskInstanceProps, isValidSubTaskInstance } from '../entities/sub-task-instance-entity';
import { SubTaskInstanceCompletedEvent } from '../events/sub-task-instance-completed-event';
import { SubTaskInstanceCreatedEvent } from '../events/sub-task-instance-created-event';
import { SubTaskInstanceDeletedEvent } from '../events/sub-task-instance-deleted-event';
import { SubTaskInstanceUpdatedEvent } from '../events/sub-task-instance-updated-event';
import { ISubTaskInstanceRepository } from '../repositories/sub-task-instance-repository-interface';
import { SubTaskInstanceStatusType } from '../value-objects/sub-task-instance-status.vo';

/**
 * 子任務實體領域服務
 * 封裝所有關於子任務實體的業務規則和邏輯
 */
export class SubTaskInstanceDomainService {
    private readonly taskInstanceService: TaskInstanceDomainService;

    constructor(private readonly repository: ISubTaskInstanceRepository) {
        this.taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);
    }

    /**
     * 創建新的子任務實體
     * 包含名稱自動生成邏輯和領域事件觸發
     */
    async createSubTaskInstance(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
        // 名稱自動生成（如: "子任務 #序號"）
        let name = data.name?.trim();
        if (!name) {
            // 查詢目前任務下已有幾個子任務，自動編號
            const siblings = await this.repository.findByTaskId(data.taskId);
            name = `子任務 #${siblings.length + 1}`;
        }

        // 創建子任務
        const subTaskInstance = await this.repository.create({
            ...data,
            name,
            priority: data.priority ?? 0,
            status: data.status ?? 'TODO'
        });

        // 確保返回的是有效的子任務實體
        if (!isValidSubTaskInstance(subTaskInstance)) {
            throw new Error('儲存庫返回的子任務數據無效');
        }

        // 發布領域事件
        new SubTaskInstanceCreatedEvent(subTaskInstance.id, subTaskInstance.name, subTaskInstance.taskId);

        return subTaskInstance;
    }

    /**
     * 更新子任務實體
     * 包含自動狀態推導和父任務聚合更新
     */
    async updateSubTaskInstance(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance> {
        // 驗證ID
        if (!id?.trim()) {
            throw new Error('子任務ID不能為空');
        }

        // 檢查子任務是否存在
        const existingSubTaskInstance = await this.repository.findById(id);
        if (!existingSubTaskInstance) {
            throw new Error(`找不到ID為 ${id} 的子任務`);
        }

        // 驗證名稱
        if (data.name !== undefined && !data.name.trim()) {
            throw new Error('子任務名稱不能為空');
        }

        // === 強化：根據 status 或 completionRate 自動推導對方 ===
        let updateData = { ...data };

        // 1. 若 status 被設為 DONE/TODO，強制 completionRate
        if (data.status !== undefined) {
            if (data.status === 'DONE') {
                updateData.completionRate = 100;
            } else if (data.status === 'TODO') {
                updateData.completionRate = 0;
            }
        }

        // 2. 若 completionRate 被設為 100，強制 status = DONE
        if (data.completionRate !== undefined) {
            if (data.completionRate >= 100) {
                updateData.status = 'DONE';
                updateData.completionRate = 100;
            } else if (data.completionRate === 0) {
                updateData.status = 'TODO';
            } else if (data.completionRate > 0 && data.completionRate < 100) {
                updateData.status = 'IN_PROGRESS';
            }
        }

        // 更新子任務
        let updatedSubTaskInstance = await this.repository.update(id, updateData);

        // === 自動推導完成率與狀態（設備數量變動時） ===
        if (
            updateData.actualEquipmentCount !== undefined ||
            updateData.equipmentCount !== undefined
        ) {
            const current = updatedSubTaskInstance;
            const equipmentCount = updateData.equipmentCount ?? current.equipmentCount ?? 0;
            const actualEquipmentCount = updateData.actualEquipmentCount ?? current.actualEquipmentCount ?? 0;

            let completionRate = equipmentCount > 0
                ? Math.round((actualEquipmentCount / equipmentCount) * 100)
                : 0;

            // 若已完成，強制 100%
            if (current.status === 'DONE' || completionRate > 100) completionRate = 100;
            if (current.status === 'TODO') completionRate = 0;

            let status: SubTaskInstanceStatusType = current.status;
            if (completionRate >= 100) status = 'DONE';
            else if (completionRate > 0) status = 'IN_PROGRESS';
            else status = 'TODO';

            // 若有變動則再更新
            if (
                completionRate !== current.completionRate ||
                status !== current.status
            ) {
                updatedSubTaskInstance = await this.repository.update(id, {
                    completionRate,
                    status
                });
            }
        }

        // 發布領域事件
        new SubTaskInstanceUpdatedEvent(updatedSubTaskInstance.id, updatedSubTaskInstance.name);

        // 檢查是否變為已完成狀態
        if (updatedSubTaskInstance.status === 'DONE' && existingSubTaskInstance.status !== 'DONE') {
            new SubTaskInstanceCompletedEvent(updatedSubTaskInstance.id, updatedSubTaskInstance.taskId);
        }

        // === 聚合根：同步父任務的 actualEquipmentCount、完成率與狀態 ===
        await this.syncParentTaskState(updatedSubTaskInstance.taskId);

        return updatedSubTaskInstance;
    }

    /**
     * 同步父任務狀態
     * 根據所有子任務的數據更新父任務的聚合狀態
     */
    private async syncParentTaskState(taskId: string): Promise<void> {
        // 查詢所有子任務
        const allSubTasks = await this.repository.findByTaskId(taskId);

        // 彙總所有子任務的 actualEquipmentCount 與 equipmentCount
        const totalActualEquipmentCount = allSubTasks.reduce(
            (sum, st) => sum + (st.actualEquipmentCount ?? 0),
            0
        );
        const totalEquipmentCount = allSubTasks.reduce(
            (sum, st) => sum + (st.equipmentCount ?? 0),
            0
        );

        // 父任務完成率：所有子任務設備數量總和為 0 則為 0，否則為所有子任務的 actualEquipmentCount / equipmentCount 百分比
        let parentCompletionRate = 0;
        if (totalEquipmentCount > 0) {
            parentCompletionRate = Math.round((totalActualEquipmentCount / totalEquipmentCount) * 100);
            if (parentCompletionRate > 100) parentCompletionRate = 100;
        }

        // 檢查是否全部完成
        const allDone = allSubTasks.length > 0 && allSubTasks.every(st => st.status === 'DONE' || st.completionRate === 100);

        // 父任務狀態
        const parentStatus =
            allDone
                ? 'DONE'
                : parentCompletionRate > 0
                    ? 'IN_PROGRESS'
                    : 'TODO';

        // 更新父任務
        await this.taskInstanceService.updateTaskInstance(taskId, {
            actualEquipmentCount: totalActualEquipmentCount,
            equipmentCount: totalEquipmentCount > 0 ? totalEquipmentCount : undefined,
            completionRate: parentCompletionRate,
            status: parentStatus
        });
    }

    /**
     * 刪除子任務實體
     * 包括刪除前的檢查和刪除後的事件觸發
     */
    async deleteSubTaskInstance(id: string): Promise<void> {
        // 驗證ID
        if (!id?.trim()) {
            throw new Error('子任務ID不能為空');
        }

        // 檢查子任務是否存在
        const subTask = await this.repository.findById(id);
        if (!subTask) {
            throw new Error(`找不到ID為 ${id} 的子任務`);
        }

        const taskId = subTask.taskId;

        // 刪除子任務
        await this.repository.delete(id);

        // 發布領域事件
        new SubTaskInstanceDeletedEvent(id);

        // 同步父任務狀態
        await this.syncParentTaskState(taskId);
    }

    /**
     * 獲取子任務實體ById
     */
    async getSubTaskInstanceById(id: string): Promise<SubTaskInstance | null> {
        if (!id?.trim()) {
            throw new Error('子任務ID不能為空');
        }

        return this.repository.findById(id);
    }

    /**
     * 獲取特定任務的所有子任務
     */
    async listSubTasksInstanceByTaskId(taskId: string): Promise<SubTaskInstance[]> {
        if (!taskId?.trim()) {
            throw new Error('任務ID不能為空');
        }

        return this.repository.findByTaskId(taskId);
    }

    /**
     * 獲取所有子任務
     */
    async listSubTasksInstance(): Promise<SubTaskInstance[]> {
        return this.repository.list();
    }

    /**
     * 更新子任務狀態
     */
    async updateSubTaskInstanceStatus(id: string, status: SubTaskInstanceStatusType): Promise<SubTaskInstance> {
        return this.updateSubTaskInstance(id, { status });
    }

    /**
     * 更新子任務完成率
     */
    async updateSubTaskInstanceCompletion(id: string, completionRate: number): Promise<SubTaskInstance> {
        if (completionRate < 0 || completionRate > 100) {
            throw new Error('完成率必須在0到100之間');
        }

        return this.updateSubTaskInstance(id, { completionRate });
    }
}