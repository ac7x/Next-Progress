import { CreateSubTaskInstanceProps, SubTaskInstance, SubTaskInstanceStatus, UpdateSubTaskInstanceProps, isValidSubTaskInstance } from './sub-task-instance-entity';
import { SubTaskInstanceCompletedEvent, SubTaskInstanceCreatedEvent, SubTaskInstanceDeletedEvent, SubTaskInstanceUpdatedEvent } from './sub-task-instance-events';
import { ISubTaskInstanceRepository } from './sub-task-instance-repository';

export class SubTaskInstanceDomainService {
  constructor(private readonly repository: ISubTaskInstanceRepository) { }

  async createSubTaskInstance(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
    // 驗證數據
    if (!data.name?.trim()) {
      throw new Error('子任務名稱不能為空');
    }

    if (!data.taskId?.trim()) {
      throw new Error('必須指定所屬任務ID');
    }

    // 創建子任務
    const subTaskInstance = await this.repository.create({
      ...data,
      status: data.status || 'TODO'
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

    // 更新子任務
    const updatedSubTaskInstance = await this.repository.update(id, data);

    // 發布領域事件
    new SubTaskInstanceUpdatedEvent(updatedSubTaskInstance.id, updatedSubTaskInstance.name);

    // 檢查是否已完成
    if (data.status === 'DONE' || data.completionRate === 100) {
      new SubTaskInstanceCompletedEvent(updatedSubTaskInstance.id, updatedSubTaskInstance.taskId);
    }

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
