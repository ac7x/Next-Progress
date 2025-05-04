'use server';

import { TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/task-template-repository';

// Query: 依工程模板ID查詢任務模板
export async function listTaskTemplatesByEngineeringIdQuery(engineeringTemplateId: string): Promise<TaskTemplate[]> {
  if (!engineeringTemplateId?.trim()) {
    throw new Error('工程模板 ID 為必填項');
  }
  try {
    return await taskTemplateRepository.findByEngineeringTemplateId(engineeringTemplateId);
  } catch (error) {
    console.error('Failed to list task templates for engineering:', error);
    return [];
  }
}
