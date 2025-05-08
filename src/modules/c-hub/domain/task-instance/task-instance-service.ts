import { TaskInstance, TaskInstanceStatus, UpdateTaskInstanceProps, isValidTaskInstance } from './task-instance-entity';
import { TaskInstanceCompletedEvent, TaskInstanceUpdatedEvent } from './task-instance-events';
import { ITaskInstanceRepository } from './task-instance-repository';

export class TaskInstanceDomainService {
    constructor(private readonly repository: ITaskInstanceRepository) { }

    async list(): Promise<TaskInstance[]> {
        return this.repository.list();
    }

    async getById(id: string): Promise<TaskInstance | null> {
        if (!id?.trim()) throw new Error('任務ID不能為空');
        return this.repository.findById(id);
    }

    async updateTaskInstance(id: string, data: UpdateTaskInstanceProps): Promise<TaskInstance> {
        // 驗證ID
        if (!id?.trim()) {
            throw new Error('任務ID不能為空');
        }

        // 檢查任務是否存在
        const existingTask = await this.repository.findById(id);
        if (!existingTask) {
            throw new Error(`找不到ID為 ${id} 的任務`);
        }

        // 更新任務
        let updatedTask = await this.repository.update(id, data);

        // === 新增：自動推導完成率與狀態 ===
        if (
          data.actualEquipmentCount !== undefined ||
          data.equipmentCount !== undefined
        ) {
          const equipmentCount = data.equipmentCount ?? updatedTask.equipmentCount ?? 0;
          const actualEquipmentCount = data.actualEquipmentCount ?? updatedTask.actualEquipmentCount ?? 0;

          let completionRate = equipmentCount > 0
            ? Math.round((actualEquipmentCount / equipmentCount) * 100)
            : 0;

          if (completionRate > 100) completionRate = 100;

          let status: TaskInstanceStatus = updatedTask.status;
          if (completionRate >= 100) status = 'DONE';
          else if (completionRate > 0) status = 'IN_PROGRESS';
          else status = 'TODO';

          if (
            completionRate !== updatedTask.completionRate ||
            status !== updatedTask.status
          ) {
            updatedTask = await this.repository.update(id, {
              completionRate,
              status
            });
          }
        }

        // 驗證更新後的任務資料
        if (!isValidTaskInstance(updatedTask)) {
            throw new Error('儲存庫返回的任務資料無效');
        }

        // 發布領域事件
        new TaskInstanceUpdatedEvent(updatedTask.id, updatedTask.name);

        // 如果狀態更新為已完成或完成率為100%，發布任務完成事件
        if (data.status === 'DONE' || data.completionRate === 100) {
            new TaskInstanceCompletedEvent(updatedTask.id, updatedTask.projectId);
        }

        return updatedTask;
    }

    async updateTaskStatus(id: string, status: TaskInstanceStatus): Promise<TaskInstance> {
        return this.updateTaskInstance(id, { status });
    }
}