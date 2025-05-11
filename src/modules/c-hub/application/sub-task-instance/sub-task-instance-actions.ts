'use server';

import { CreateSubTaskInstanceProps, SubTaskInstance, SubTaskInstanceDomainService, SubTaskInstanceStatusType, UpdateSubTaskInstanceProps, isValidSubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/repositories/sub-task-instance-repository';

const subTaskInstanceService = new SubTaskInstanceDomainService(subTaskInstanceRepository);

export async function createSubTaskInstance(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
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

export async function updateSubTaskInstance(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance> {
  try {
    const subTaskInstance = await subTaskInstanceService.updateSubTaskInstance(id, data);
    return subTaskInstance;
  } catch (error) {
    console.error('更新子任務失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('更新子任務失敗: ' + String(error));
  }
}

export async function deleteSubTaskInstance(id: string): Promise<{ id: string, taskId: string }> {
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

export async function getSubTaskInstance(id: string): Promise<SubTaskInstance | null> {
  try {
    return await subTaskInstanceService.getSubTaskInstanceById(id);
  } catch (error) {
    console.error('獲取子任務失敗:', error);
    return null;
  }
}

export async function listSubTasksInstanceByTaskId(taskId: string): Promise<SubTaskInstance[]> {
  try {
    const subTasks = await subTaskInstanceService.listSubTasksInstanceByTaskId(taskId);
    return subTasks.filter(isValidSubTaskInstance);
  } catch (error) {
    console.error('獲取任務的子任務列表失敗:', error);
    return [];
  }
}

export async function updateSubTaskInstanceStatus(id: string, status: SubTaskInstanceStatusType): Promise<SubTaskInstance> {
  return updateSubTaskInstance(id, { status });
}

export async function updateSubTaskInstanceCompletion(id: string, completionRate: number): Promise<SubTaskInstance> {
  return updateSubTaskInstance(id, { completionRate });
}
