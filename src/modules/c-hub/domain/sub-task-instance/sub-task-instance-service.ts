import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/task-instance-repository';
import { TaskInstanceDomainService } from '../task-instance/task-instance-service';
import { CreateSubTaskInstanceProps, SubTaskInstance, SubTaskInstanceStatus, UpdateSubTaskInstanceProps, isValidSubTaskInstance } from './sub-task-instance-entity';
import { SubTaskInstanceCompletedEvent, SubTaskInstanceCreatedEvent, SubTaskInstanceDeletedEvent, SubTaskInstanceUpdatedEvent } from './sub-task-instance-events';
import { ISubTaskInstanceRepository } from './sub-task-instance-repository';

export class SubTaskInstanceDomainService {
  private readonly taskInstanceService = new TaskInstanceDomainService(taskInstanceRepository);

  constructor(private readonly repository: ISubTaskInstanceRepository) { }

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
      priority: 0,
      status: 'TODO'
    });

    // 確保返回的是有效的子任務實體
    if (!isValidSubTaskInstance(subTaskInstance)) {
      throw new Error('儲存庫返回的子任務數據無效');
    }

    // 發布領域事件
    new SubTaskInstanceCreatedEvent(subTaskInstance.id, subTaskInstance.name, subTaskInstance.taskId);

    return subTaskInstance;
  }

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

    // 更新子任務（允許任意欄位編輯，包括時間欄位）
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

      let status: SubTaskInstanceStatus = current.status;
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

    // === 聚合根：同步父任務的 actualEquipmentCount、完成率與狀態 ===
    // 查詢所有子任務
    const allSubTasks = await this.repository.findByTaskId(updatedSubTaskInstance.taskId);

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
    await this.taskInstanceService.updateTaskInstance(updatedSubTaskInstance.taskId, {
      actualEquipmentCount: totalActualEquipmentCount,
      equipmentCount: totalEquipmentCount > 0 ? totalEquipmentCount : undefined,
      completionRate: parentCompletionRate,
      status: parentStatus
    });

    return updatedSubTaskInstance;
  }

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

    // 刪除子任務
    await this.repository.delete(id);

    // 發布領域事件
    new SubTaskInstanceDeletedEvent(id);
  }

  async getSubTaskInstanceById(id: string): Promise<SubTaskInstance | null> {
    if (!id?.trim()) {
      throw new Error('子任務ID不能為空');
    }

    return this.repository.findById(id);
  }

  async listSubTasksInstanceByTaskId(taskId: string): Promise<SubTaskInstance[]> {
    if (!taskId?.trim()) {
      throw new Error('任務ID不能為空');
    }

    return this.repository.findByTaskId(taskId);
  }

  async listSubTasksInstance(): Promise<SubTaskInstance[]> {
    return this.repository.list();
  }

  async updateSubTaskInstanceInstanceStatus(id: string, status: SubTaskInstanceStatus): Promise<SubTaskInstance> {
    return this.updateSubTaskInstance(id, { status });
  }

  async updateSubTaskInstanceCompletion(id: string, completionRate: number): Promise<SubTaskInstance> {
    if (completionRate < 0 || completionRate > 100) {
      throw new Error('完成率必須在0到100之間');
    }

    return this.updateSubTaskInstance(id, { completionRate });
  }
}
