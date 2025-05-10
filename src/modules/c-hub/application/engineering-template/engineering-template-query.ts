'use server';

import {
    EngineeringTemplate,
    EngineeringTemplateDomainService,
    isValidEngineeringTemplate
} from '@/modules/c-hub/domain/engineering-template';
import { engineeringTemplateRepository } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-repository';

const templateService = new EngineeringTemplateDomainService(engineeringTemplateRepository);

export async function listEngineeringTemplates(): Promise<EngineeringTemplate[]> {
    try {
        const templates = await templateService.listTemplates();
        return templates.filter(isValidEngineeringTemplate);
    } catch (error) {
        console.error('獲取工程模板列表失敗:', error);
        return [];
    }
}

export async function getEngineeringTemplateById(id: string): Promise<EngineeringTemplate | null> {
    if (!id?.trim()) {
        throw new Error('工程模板 ID 不能為空');
    }
    try {
        return await templateService.getTemplateById(id);
    } catch (error) {
        console.error('獲取工程模板詳情失敗:', error);
        return null;
    }
}
