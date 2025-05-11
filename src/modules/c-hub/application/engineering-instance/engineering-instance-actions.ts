'use server';

/**
 * 工程實例行動服務 (Action Service)
 * 提供 Server Action 功能，處理工程實例的各種操作
 */

import { CreateEngineeringInstanceProps, EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance';
import { CreateEngineeringFromTemplateProps } from '@/modules/c-hub/domain/engineering-template';
import { engineeringInstanceAdapter } from '@/modules/c-hub/infrastructure/engineering-instance/adapter/engineering-instance-adapter';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/repositories/engineering-instance-repository';
import { engineeringTemplateRepository } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-repository';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/repositories/sub-task-instance-repository';
import { subTaskTemplateRepository } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template-repository';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/repositories/task-instance-repository';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/repositories/task-template-repository';
import { revalidatePath } from 'next/cache';

// 初始化領域服務
const engineeringService = new EngineeringInstanceDomainService(engineeringInstanceRepository);

/**
 * 獲取所有工程實例列表
 * @returns 工程實例列表（可序列化格式）
 */
export async function listEngineerings(): Promise<any[]> {
  try {
    const instances = await engineeringService.list();
    // 將領域實體轉換為可序列化格式
    return engineeringInstanceAdapter.toSerializableList(instances);
  } catch (error) {
    console.error('獲取工程實例列表失敗:', error);
    return [];
  }
}

/**
 * 根據ID獲取工程實例
 * @param id 工程實例ID
 * @returns 工程實例（可序列化格式）或null
 */
export async function getEngineeringById(id: string): Promise<any | null> {
  if (!id?.trim()) {
    throw new Error('工程ID不能為空');
  }

  try {
    const instance = await engineeringService.getById(id);
    // 將領域實體轉換為可序列化格式
    return instance ? engineeringInstanceAdapter.toSerializable(instance) : null;
  } catch (error) {
    console.error(`獲取工程實例(ID: ${id})失敗:`, error);
    return null;
  }
}

/**
 * 獲取特定專案的工程實例列表
 * @param projectId 專案ID
 * @returns 工程實例列表（可序列化格式）
 */
export async function listEngineeringsByProject(projectId: string): Promise<any[]> {
  if (!projectId?.trim()) {
    throw new Error('專案ID不能為空');
  }

  try {
    const instances = await engineeringInstanceRepository.listByProject(projectId);
    // 將領域實體轉換為可序列化格式
    return engineeringInstanceAdapter.toSerializableList(instances);
  } catch (error) {
    console.error(`獲取專案(ID: ${projectId})工程實例列表失敗:`, error);
    return [];
  }
}

/**
 * 創建新工程實例
 * @param data 工程實例創建資料
 * @returns 創建的工程實例（可序列化格式）
 */
export async function createEngineering(data: CreateEngineeringInstanceProps): Promise<any> {
  try {
    if (!data.name?.trim()) {
      throw new Error('工程名稱不能為空');
    }

    if (!data.projectId?.trim()) {
      throw new Error('必須指定專案ID');
    }

    const engineering = await engineeringService.create(data);

    // 重新驗證相關頁面
    revalidatePath(`/client/project/${data.projectId}`);
    revalidatePath('/client/instance_management');

    // 將領域實體轉換為可序列化格式
    return engineeringInstanceAdapter.toSerializable(engineering);
  } catch (error) {
    console.error('創建工程失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('創建工程失敗: ' + String(error));
  }
}

/**
 * 從模板創建工程實例
 * @param data 從模板創建工程實例所需資料
 * @returns 創建的工程實例（可序列化格式）
 */
export async function createEngineeringFromTemplate(
  data: CreateEngineeringFromTemplateProps
): Promise<any> {
  try {
    if (!data.engineeringTemplateId?.trim()) {
      throw new Error('工程模板ID不能為空');
    }
    if (!data.projectId?.trim()) {
      throw new Error('專案ID不能為空');
    }

    // 1. 取得模板
    const template = await engineeringTemplateRepository.getById(data.engineeringTemplateId);
    if (!template) throw new Error('找不到指定的工程模板');

    // 2. 建立工程
    const engineering = await engineeringService.create({
      name: data.name || template.name,
      description: data.description || template.description,
      projectId: data.projectId,
      userId: data.userId || 'system'
    });

    // 3. 取得任務模板
    const taskTemplates = await taskTemplateRepository.findByEngineeringTemplateId(data.engineeringTemplateId);

    // 4. 預查所有子任務模板
    const allSubTaskTemplatesMap: Record<string, any[]> = {};
    await Promise.all(
      taskTemplates.map(async (taskTemplate) => {
        allSubTaskTemplatesMap[taskTemplate.id] = await subTaskTemplateRepository.findByTaskTemplateId(taskTemplate.id);
      })
    );

    // 5. 根據前端傳來的數量資訊建立任務
    const taskCountMap: Record<string, number> = {};
    if (Array.isArray(data.tasks)) {
      data.tasks.forEach(t => {
        if (t.taskTemplateId && t.count > 0) {
          taskCountMap[t.taskTemplateId] = t.count;
        }
      });
    }

    await Promise.all(
      taskTemplates.map(async (taskTemplate) => {
        const count = taskCountMap[taskTemplate.id] ?? 1;
        const task = await taskInstanceRepository.create({
          name: taskTemplate.name,
          description: taskTemplate.description,
          engineeringId: engineering.id,
          projectId: data.projectId,
          status: 'TODO',
          priority: taskTemplate.priority ?? 0,
          equipmentCount: count
        });

        // 建立子任務
        const subTaskTemplates = allSubTaskTemplatesMap[taskTemplate.id] || [];
        if (subTaskTemplates.length > 0) {
          await Promise.all(
            subTaskTemplates.map(subTemplate =>
              subTaskInstanceRepository.create({
                name: subTemplate.name,
                description: subTemplate.description,
                priority: subTemplate.priority ?? 0,
                taskId: task.id,
                status: 'TODO',
              })
            )
          );
        }
      })
    );

    // 重新驗證相關頁面
    revalidatePath(`/client/project/${data.projectId}`);
    revalidatePath('/client/instance_management');

    // 將領域實體轉換為可序列化格式
    return engineeringInstanceAdapter.toSerializable(engineering);
  } catch (error) {
    console.error('從模板創建工程失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('從模板創建工程失敗: ' + String(error));
  }
}
