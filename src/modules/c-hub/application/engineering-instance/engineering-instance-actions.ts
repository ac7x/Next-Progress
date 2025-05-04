'use server';

import { CreateEngineeringInstanceProps, EngineeringInstance } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-entity';
import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-service';
import { CreateEngineeringFromTemplateProps } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/engineering-instance-repository';
import { engineeringTemplateRepository } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-repository';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/sub-task-instance-repository';
import { subTaskTemplateRepository } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template-repository';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/task-instance-repository';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/task-template-repository';
import { revalidatePath } from 'next/cache';

// 創建工程領域服務實例，注入任務模板資源庫
const engineeringService = new EngineeringInstanceDomainService(
  engineeringInstanceRepository,
  engineeringTemplateRepository,
  taskTemplateRepository
);

export async function listEngineerings(): Promise<EngineeringInstance[]> {
  return engineeringService.list();
}

export async function getEngineeringById(id: string): Promise<EngineeringInstance | null> {
  if (!id?.trim()) {
    throw new Error('工程ID不能為空');
  }
  return engineeringService.getById(id);
}

export async function listEngineeringsByProject(projectId: string): Promise<EngineeringInstance[]> {
  if (!projectId?.trim()) {
    throw new Error('專案ID不能為空');
  }
  return engineeringInstanceRepository.listByProject(projectId);
}

export async function createEngineering(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance> {
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
    revalidatePath('/client/manage');

    return engineering;
  } catch (error) {
    console.error('創建工程失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('創建工程失敗: ' + String(error));
  }
}

export async function createEngineeringFromTemplate(
  data: CreateEngineeringFromTemplateProps
): Promise<EngineeringInstance> {
  try {
    if (!data.engineeringTemplateId?.trim()) {
      throw new Error('工程模板ID不能為空');
    }
    if (!data.projectId?.trim()) {
      throw new Error('專案ID不能為空');
    }

    // 步驟1: 創建工程
    const engineering = await engineeringService.createFromTemplate(data);

    // 步驟2: 獲取該工程模板相關的所有任務模板
    const taskTemplates = await taskTemplateRepository.findByEngineeringTemplateId(data.engineeringTemplateId);

    // 步驟2.5: 批量查詢所有子任務模板，減少 DB 請求
    const allSubTaskTemplatesMap: Record<string, any[]> = {};
    await Promise.all(
      taskTemplates.map(async (taskTemplate) => {
        allSubTaskTemplatesMap[taskTemplate.id] = await subTaskTemplateRepository.findByTaskTemplateId(taskTemplate.id);
      })
    );

    // 步驟3: 根據前端傳來的數量資訊建立任務（只產生一筆，equipmentCount 設為數量）
    const taskCountMap: Record<string, number> = {};
    if (Array.isArray(data.tasks)) {
      data.tasks.forEach(t => {
        if (t.taskTemplateId && t.count > 0) {
          taskCountMap[t.taskTemplateId] = t.count;
        }
      });
    }

    // 只產生一筆 Task，equipmentCount 設為數量
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
          equipmentCount: count // 關鍵：堆疊數量
        });

        // 使用預先查詢的子任務模板
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
    revalidatePath('/client/manage');

    return engineering;
  } catch (error) {
    console.error('從模板創建工程失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('從模板創建工程失敗: ' + String(error));
  }
}
