'use server';

import { CreateSubTaskTemplateProps, SubTaskTemplate, UpdateSubTaskTemplateProps, isValidSubTaskTemplate } from '@/modules/c-hub/domain/sub-task-template/sub-task-template-entity';
import { SubTaskTemplateDomainService } from '@/modules/c-hub/domain/sub-task-template/sub-task-template-service';
import { subTaskTemplateRepository } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template-repository';
import { revalidatePath } from 'next/cache';

const templateService = new SubTaskTemplateDomainService(subTaskTemplateRepository);

export async function createSubTaskTemplate(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate> {
    if (!data.name?.trim()) {
        throw new Error('子任務模板名稱為必填項');
    }

    if (!data.taskTemplateId?.trim()) {
        throw new Error('任務模板ID為必填項');
    }

    try {
        const template = await templateService.createTemplate({
            ...data,
            isActive: data.isActive ?? true,
        });

        if (!isValidSubTaskTemplate(template)) {
            throw new Error('無效的子任務模板數據');
        }

        revalidatePath('/client/template');
        revalidatePath(`/client/template/subtask-template/${data.taskTemplateId}`);

        return template;
    } catch (error) {
        console.error('建立子任務模板失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('建立子任務模板失敗: ' + String(error));
    }
}

export async function updateSubTaskTemplate(
    id: string,
    data: UpdateSubTaskTemplateProps
): Promise<SubTaskTemplate> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }

    try {
        const template = await templateService.updateTemplate(id, data);
        revalidatePath('/client/template');

        if (data.taskTemplateId) {
            revalidatePath(`/client/template/subtask-template/${data.taskTemplateId}`);
        }

        return template;
    } catch (error) {
        console.error('更新子任務模板失敗:', error);
        throw error instanceof Error ? error : new Error('更新子任務模板失敗');
    }
}

export async function deleteSubTaskTemplate(id: string): Promise<void> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }

    try {
        // 先獲取模板以取得任務模板ID
        const template = await getSubTaskTemplate(id);

        await templateService.deleteTemplate(id);

        revalidatePath('/client/template');
        if (template?.taskTemplateId) {
            revalidatePath(`/client/template/subtask-template/${template.taskTemplateId}`);
        }
    } catch (error) {
        console.error('刪除子任務模板失敗:', error);
        throw error instanceof Error ? error : new Error('刪除子任務模板失敗');
    }
}

export async function getSubTaskTemplate(id: string): Promise<SubTaskTemplate | null> {
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

export async function listSubTaskTemplates(): Promise<SubTaskTemplate[]> {
    try {
        const templates = await templateService.listTemplates();
        return templates.filter(isValidSubTaskTemplate);
    } catch (error) {
        console.error('列出子任務模板失敗:', error);
        return [];
    }
}

export async function listSubTaskTemplatesByTaskTemplateId(taskTemplateId: string): Promise<SubTaskTemplate[]> {
    if (!taskTemplateId?.trim()) {
        throw new Error('任務模板 ID 為必填項');
    }

    try {
        const templates = await templateService.listTemplatesByTaskTemplateId(taskTemplateId);
        return templates.filter(isValidSubTaskTemplate);
    } catch (error) {
        console.error('列出子任務模板失敗:', error);
        return [];
    }
}