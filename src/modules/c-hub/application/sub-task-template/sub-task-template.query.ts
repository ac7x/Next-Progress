'use server';

import { SubTaskTemplate } from '@/modules/c-hub/domain/sub-task-template/entities/sub-task-template-entity';
import { SubTaskTemplateDomainService } from '@/modules/c-hub/domain/sub-task-template/services/sub-task-template-service';
import { subTaskTemplateRepository } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template-repository';

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

// Query DTO
export interface ListSubTaskTemplatesByTaskTemplateIdQuery {
    taskTemplateId: string;
}

// Response DTO
export interface SubTaskTemplateListResponse {
    templates: SubTaskTemplate[];
}

// Query Handler
export async function listSubTaskTemplatesByTaskTemplateIdHandler(
    query: ListSubTaskTemplatesByTaskTemplateIdQuery
): Promise<SubTaskTemplateListResponse> {
    if (!query.taskTemplateId?.trim()) {
        throw new Error('任務模板 ID 為必填項');
    }
    try {
        const templates = await templateService.listTemplatesByTaskTemplateId(query.taskTemplateId);
        return { templates };
    } catch (error) {
        console.error('列出子任務模板失敗:', error);
        return { templates: [] };
    }
}