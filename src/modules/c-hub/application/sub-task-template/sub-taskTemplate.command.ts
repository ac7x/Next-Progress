'use server';

import { CreateSubTaskTemplateProps, isValidSubTaskTemplate, SubTaskTemplate, SubTaskTemplateDomainService, UpdateSubTaskTemplateProps } from '@/modules/c-hub/domain/sub-task-template';
import { subTaskTemplateRepository } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template-repository';
import { revalidatePath } from 'next/cache';

const templateService = new SubTaskTemplateDomainService(subTaskTemplateRepository);

// Command: 建立子任務模板
export async function createSubTaskTemplateCommand(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate> {
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

// Command: 更新子任務模板
export async function updateSubTaskTemplateCommand(
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

// Command: 刪除子任務模板
export async function deleteSubTaskTemplateCommand(id: string, taskTemplateId?: string): Promise<void> {
    if (!id?.trim()) {
        throw new Error('模板 ID 為必填項');
    }

    try {
        await templateService.deleteTemplate(id);
        revalidatePath('/client/template');
        if (taskTemplateId) {
            revalidatePath(`/client/template/subtask-template/${taskTemplateId}`);
        }
    } catch (error) {
        console.error('刪除子任務模板失敗:', error);
        throw error instanceof Error ? error : new Error('刪除子任務模板失敗');
    }
}