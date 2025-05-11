'use server';

import {
    EngineeringTemplate,
    EngineeringTemplateDomainService,
    isValidEngineeringTemplate
} from '@/modules/c-hub/domain/engineering-template';
import { engineeringTemplateAdapter } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-adapter';
import { engineeringTemplateRepository } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-repository';

const templateService = new EngineeringTemplateDomainService(engineeringTemplateRepository);

export async function listEngineeringTemplates(): Promise<EngineeringTemplate[]> {
    try {
        const templates = await templateService.listTemplates();
        const validTemplates = templates.filter(isValidEngineeringTemplate);
        // 確保所有返回的模板都是可序列化的
        return validTemplates.map(template => engineeringTemplateAdapter.toSerializable(template));
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
        const template = await templateService.getTemplateById(id);
        // 如果找到模板，確保它可序列化
        return template ? engineeringTemplateAdapter.toSerializable(template) : null;
    } catch (error) {
        console.error('獲取工程模板詳情失敗:', error);
        return null;
    }
}
