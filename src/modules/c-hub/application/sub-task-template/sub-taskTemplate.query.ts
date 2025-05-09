'use server';

import { SubTaskTemplate, SubTaskTemplateDomainService } from '@/modules/c-hub/domain/sub-task-template';
import { subTaskTemplateRepository } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template.repository';

const templateService = new SubTaskTemplateDomainService(subTaskTemplateRepository);

// Query: 取得單一子任務模板
export async function getSubTaskTemplateQuery(id: string): Promise<SubTaskTemplate | null> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }
    try {
        return await templateService.getTemplateById(id);
    } catch (error) {
        console.error('獲取子任務模板失敗:', error);
        return null;
    }
}

// Query: 依 TaskTemplateId 取得子任務模板清單
export async function listSubTaskTemplatesByTaskTemplateId(taskTemplateId: string): Promise<SubTaskTemplate[]> {
    if (!taskTemplateId?.trim()) {
        throw new Error('任務模板 ID 為必填項');
    }
    try {
        return await templateService.listTemplatesByTaskTemplateId(taskTemplateId);
    } catch (error) {
        console.error('列出子任務模板失敗:', error);
        return [];
    }
}