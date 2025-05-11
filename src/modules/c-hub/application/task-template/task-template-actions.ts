'use server';

import { CreateTaskTemplateProps, TaskTemplate, TaskTemplateDomainService, UpdateTaskTemplateProps, isValidTaskTemplate } from '@/modules/c-hub/domain/task-template';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/repositories/task-template-repository';
import { revalidatePath } from 'next/cache';

const templateService = new TaskTemplateDomainService(taskTemplateRepository);

export async function listTaskTemplates(): Promise<TaskTemplate[]> {
  try {
    const templates = await templateService.listTemplates();
    return templates.filter(isValidTaskTemplate);
  } catch (error) {
    console.error('Failed to list task templates:', error);
    return [];
  }
}

export async function createTaskTemplate(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
  if (!data.name?.trim()) {
    throw new Error('任務模板名稱為必填項');
  }

  try {
    const template = await templateService.createTemplate({
      ...data,
      isActive: data.isActive ?? true,
    });

    if (!isValidTaskTemplate(template)) {
      throw new Error('無效的任務模板數據');
    }

    revalidatePath('/client/template_management');

    return template;
  } catch (error) {
    console.error('建立任務模板失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('建立任務模板失敗: ' + String(error));
  }
}

export async function updateTaskTemplate(
  id: string,
  data: UpdateTaskTemplateProps
): Promise<TaskTemplate> {
  if (!id?.trim()) {
    throw new Error('模板 ID 為必填項');
  }

  try {
    const template = await templateService.updateTemplate(id, data);
    revalidatePath('/client/template_management');
    return template;
  } catch (error) {
    console.error('Failed to update task template:', error);
    throw error instanceof Error ? error : new Error('Failed to update task template');
  }
}

export async function deleteTaskTemplate(id: string): Promise<void> {
  if (!id?.trim()) {
    throw new Error('模板 ID 為必填項');
  }

  try {
    await templateService.deleteTemplate(id);
    revalidatePath('/client/template_management');
  } catch (error) {
    console.error('Failed to delete task template:', error);
    throw error instanceof Error ? error : new Error('Failed to delete task template');
  }
}

export async function getTaskTemplate(id: string): Promise<TaskTemplate | null> {
  if (!id?.trim()) {
    throw new Error('模板 ID 為必填項');
  }

  try {
    return await templateService.getTemplateById(id);
  } catch (error) {
    console.error('Failed to get task template:', error);
    return null;
  }
}

export async function listTaskTemplatesByEngineeringId(engineeringId: string): Promise<TaskTemplate[]> {
  if (!engineeringId?.trim()) {
    throw new Error('工程模板 ID 為必填項');
  }

  try {
    return await templateService.findTemplatesByEngineeringId(engineeringId);
  } catch (error) {
    console.error('Failed to list task templates for engineering:', error);
    return [];
  }
}
