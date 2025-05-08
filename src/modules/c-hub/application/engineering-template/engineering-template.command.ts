'use server';

import {
    CreateEngineeringTemplateProps,
    EngineeringTemplate,
    UpdateEngineeringTemplateProps,
    isValidEngineeringTemplate
} from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { EngineeringTemplateDomainService } from '@/modules/c-hub/domain/engineering-template/engineering-template-service';
import { engineeringTemplateRepository } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-repository';
import { revalidatePath } from 'next/cache';

const templateService = new EngineeringTemplateDomainService(engineeringTemplateRepository);

// Command: 建立工程模板
export async function createEngineeringTemplate(
    data: CreateEngineeringTemplateProps
): Promise<EngineeringTemplate> {
    if (!data.name?.trim()) {
        throw new Error('工程模板名稱為必填項');
    }
    try {
        const template = await templateService.createTemplate(data);
        if (!isValidEngineeringTemplate(template)) {
            throw new Error('無效的模板資料');
        }
        revalidatePath('/client/template');
        return template;
    } catch (error) {
        console.error('建立工程模板失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('建立工程模板失敗: ' + String(error));
    }
}

// Command: 更新工程模板
export async function updateEngineeringTemplate(
    id: string,
    data: UpdateEngineeringTemplateProps
): Promise<EngineeringTemplate> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }
    try {
        const template = await templateService.updateTemplate(id, data);
        revalidatePath('/client/template');
        return template;
    } catch (error) {
        console.error('更新工程模板失敗:', error);
        throw error instanceof Error ? error : new Error('更新工程模板失敗');
    }
}

// Command: 刪除工程模板
export async function deleteEngineeringTemplate(id: string): Promise<void> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }
    try {
        await templateService.deleteTemplate(id);
        revalidatePath('/client/template');
    } catch (error) {
        console.error('刪除工程模板失敗:', error);
        if (error instanceof Error && error.message.includes('找不到ID')) {
            throw new Error(`刪除失敗: ${error.message}`);
        } else {
            throw new Error(error instanceof Error ? error.message : '刪除工程模板失敗');
        }
    }
}
