'use server';

import { TaskTemplate, TaskTemplateDomainService } from '@/modules/c-hub/domain/task-template';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/repositories/task-template-repository';

const templateService = new TaskTemplateDomainService(taskTemplateRepository);

// Query: 取得所有任務模板
export async function listTaskTemplatesQuery(): Promise<TaskTemplate[]> {
    return templateService.listTemplates();
}

// Query: 依ID取得任務模板
export async function getTaskTemplateQuery(id: string): Promise<TaskTemplate | null> {
    if (!id?.trim()) throw new Error('模板 ID 為必填項');
    return templateService.getTemplateById(id);
}

// Query: 依工程模板ID查詢任務模板
export async function listTaskTemplatesByEngineeringIdQuery(engineeringTemplateId: string): Promise<TaskTemplate[]> {
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');
    return templateService.findTemplatesByEngineeringId(engineeringTemplateId);
}
