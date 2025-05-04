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

// Query UseCases
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

// Command UseCases
export async function createEngineeringTemplate(
    data: CreateEngineeringTemplateProps
): Promise<EngineeringTemplate> {
    if (!data.name?.trim()) {
        throw new Error('工程模板名稱為必填項');
    }

    try {
        // 移除 isActive 屬性，這不存在於 CreateEngineeringTemplateProps 中
        const template = await templateService.createTemplate(data);

        if (!isValidEngineeringTemplate(template)) {
            throw new Error('無效的模板資料');
        }

        // 確保在數據修改後重新驗證頁面數據
        revalidatePath('/client/template');

        return template;
    } catch (error) {
        console.error('建立工程模板失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('建立工程模板失敗: ' + String(error));
    }
}

export async function updateEngineeringTemplate(
    id: string,
    data: UpdateEngineeringTemplateProps
): Promise<EngineeringTemplate> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }

    try {
        const template = await templateService.updateTemplate(id, data);

        // 確保在數據修改後重新驗證頁面數據
        revalidatePath('/client/template');

        return template;
    } catch (error) {
        console.error('更新工程模板失敗:', error);
        throw error instanceof Error ? error : new Error('更新工程模板失敗');
    }
}

export async function deleteEngineeringTemplate(id: string): Promise<void> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }

    try {
        await templateService.deleteTemplate(id);

        // 確保在數據修改後重新驗證頁面數據
        revalidatePath('/client/template');
    } catch (error) {
        console.error('刪除工程模板失敗:', error);
        // 提供更友善的錯誤訊息
        if (error instanceof Error && error.message.includes('找不到ID')) {
            throw new Error(`刪除失敗: ${error.message}`);
        } else {
            throw new Error(error instanceof Error ? error.message : '刪除工程模板失敗');
        }
    }
}