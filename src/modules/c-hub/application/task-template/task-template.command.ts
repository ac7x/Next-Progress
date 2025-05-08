'use server';

import { CreateTaskTemplateProps, TaskTemplate, UpdateTaskTemplateProps, isValidTaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { TaskTemplateDomainService } from '@/modules/c-hub/domain/task-template/task-template-service';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/task-template-repository';
import { revalidatePath } from 'next/cache';

const templateService = new TaskTemplateDomainService(taskTemplateRepository);

// Command: 建立任務模板
export async function createTaskTemplateCommand(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
    if (!data.name?.trim()) throw new Error('任務模板名稱為必填項');
    const template = await templateService.createTemplate({ ...data, isActive: data.isActive ?? true });
    if (!isValidTaskTemplate(template)) throw new Error('無效的任務模板數據');
    revalidatePath('/client/template');
    return template;
}

// Command: 更新任務模板
export async function updateTaskTemplateCommand(id: string, data: UpdateTaskTemplateProps): Promise<TaskTemplate> {
    if (!id?.trim()) throw new Error('模板 ID 為必填項');
    const template = await templateService.updateTemplate(id, data);
    revalidatePath('/client/template');
    return template;
}

// Command: 刪除任務模板
export async function deleteTaskTemplateCommand(id: string): Promise<void> {
    if (!id?.trim()) throw new Error('模板 ID 為必填項');
    await templateService.deleteTemplate(id);
    revalidatePath('/client/template');
}
