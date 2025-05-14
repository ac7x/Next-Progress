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

        // 紀錄更新前的狀態
        const previousStatus = existingSubTaskInstance.status;
        const previousCompletionRate = existingSubTaskInstance.completionRate;
        const previousActualEquipmentCount = existingSubTaskInstance.actualEquipmentCount;

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
                console.log(`更新子任務狀態: ID=${id}, 新完成率=${completionRate}%, 新狀態=${status}, 實際設備數量=${actualEquipmentCount}`);
                updatedSubTaskInstance = await this.repository.update(id, {
                    completionRate,
                    status
                });
            }
        }

        // 檢查是否有重大變動（實際設備數量、完成率或狀態變化）
        const hasSignificantChanges =
            updatedSubTaskInstance.actualEquipmentCount !== previousActualEquipmentCount ||
            updatedSubTaskInstance.completionRate !== previousCompletionRate ||
            updatedSubTaskInstance.status !== previousStatus;

        // 發布領域事件
        new SubTaskInstanceUpdatedEvent(updatedSubTaskInstance.id, updatedSubTaskInstance.name);

        // 檢查是否變為已完成狀態
        if (updatedSubTaskInstance.status === 'DONE' && existingSubTaskInstance.status !== 'DONE') {
            new SubTaskInstanceCompletedEvent(updatedSubTaskInstance.id, updatedSubTaskInstance.taskId);
        }

        // === 聚合根：同步父任務的 actualEquipmentCount、完成率與狀態 ===
        // 只有在有重大變動時才觸發父任務同步，減少不必要的數據庫操作
        if (hasSignificantChanges) {
            console.log(`子任務 ${id} 發生重大變更，將同步更新父任務 ${updatedSubTaskInstance.taskId}`);
            await this.syncParentTaskState(updatedSubTaskInstance.taskId);
        }

        return updatedSubTaskInstance;
    }

    /**
     * 同步父任務狀態
     * 根據所有子任務的數據更新父任務的聚合狀態
     */
    private async syncParentTaskState(taskId: string): Promise<void> {
        // 獲取父任務資訊
        const parentTask = await this.taskInstanceService.getTaskInstanceById(taskId);
        if (!parentTask) {
            console.error(`無法同步父任務狀態：找不到ID為 ${taskId} 的父任務`);
            return;
        }

        // 查詢所有子任務
        const allSubTasks = await this.repository.findByTaskId(taskId);

        // 如果沒有子任務，保持父任務原有資訊
        if (allSubTasks.length === 0) {
            console.log(`任務 ${taskId} 沒有子任務，保持原有狀態`);
            return;
        }

        // 彙總所有子任務的 actualEquipmentCount 與 equipmentCount
        const totalActualEquipmentCount = allSubTasks.reduce(
            (sum, st) => sum + (st.actualEquipmentCount ?? 0),
            0
        );
        const totalEquipmentCount = allSubTasks.reduce(
            (sum, st) => sum + (st.equipmentCount ?? 0),
            0
        );

        // 父任務完成率計算
        let parentCompletionRate = 0;

        // 使用父任務自己的 equipmentCount 作為分母，確保百分比計算正確
        const parentEquipmentCount = parentTask.equipmentCount || totalEquipmentCount;

        if (parentEquipmentCount > 0) {
            parentCompletionRate = Math.round((totalActualEquipmentCount / parentEquipmentCount) * 100);
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

        console.log(`同步父任務 ${taskId} 狀態：
            - 所有子任務實際設備數量總和：${totalActualEquipmentCount}
            - 父任務完成率：${parentCompletionRate}%
            - 新狀態：${parentStatus}`);

        // 更新父任務
        await this.taskInstanceService.updateTaskInstance(taskId, {
            actualEquipmentCount: totalActualEquipmentCount,
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
     * 批量更新子任務實際數量並同步父任務
     * @param updates 子任務ID與實際設備數量的映射
     */
    async batchUpdateActualEquipment(updates: { id: string, actualEquipmentCount: number }[]): Promise<void> {
        if (!updates.length) return;

        // 分組子任務更新，按父任務ID分組以減少數據庫操作次數
        const taskGroups = new Map<string, string[]>();

        // 逐個更新子任務
        for (const update of updates) {
            const subTask = await this.getSubTaskInstanceById(update.id);
            if (!subTask) continue;

            // 記錄子任務所屬父任務ID，用於後續批量更新父任務
            if (!taskGroups.has(subTask.taskId)) {
                taskGroups.set(subTask.taskId, []);
            }
            taskGroups.get(subTask.taskId)?.push(update.id);

            // 更新子任務
            await this.updateSubTaskInstance(update.id, {
                actualEquipmentCount: update.actualEquipmentCount
            });
        }

        // 批量同步父任務狀態
        for (const [taskId, _] of taskGroups) {
            await this.syncParentTaskState(taskId);
        }
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