'use server';

import { CreateProjectTemplateProps, ProjectTemplate, isValidProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectTemplateDomainService } from '@/modules/c-hub/domain/project-template/project-template-service';
import { projectTemplateRepository } from '@/modules/c-hub/infrastructure/project-template/project-template-repository';
import { revalidatePath } from 'next/cache';

const templateService = new ProjectTemplateDomainService(projectTemplateRepository);

export async function createProjectTemplate(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
  try {
    if (!data.name.trim()) {
      throw new Error('Template name is required');
    }

    const template = await templateService.createTemplate({
      ...data,
      isActive: data.isActive ?? true,
    });

    if (!isValidProjectTemplate(template)) {
      throw new Error('無效的專案模板數據');
    }

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/template');

    return template;
  } catch (error) {
    console.error('Failed to create template:', error);
    throw error instanceof Error ? error : new Error('Failed to create template');
  }
}

export async function listProjectTemplates(): Promise<ProjectTemplate[]> {
  try {
    const templates = await templateService.listTemplates();
    return templates.filter(isValidProjectTemplate);
  } catch (error) {
    console.error('Failed to list templates:', error);
    return [];
  }
}

export async function deleteProjectTemplate(id: string): Promise<void> {
  if (!id) {
    throw new Error('Template ID is required');
  }

  try {
    await templateService.deleteTemplate(id);

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/template');
  } catch (error) {
    console.error('Failed to delete template:', error);
    throw error instanceof Error ? error : new Error('Failed to delete template');
  }
}

export async function updateProjectTemplate(
  id: string,
  data: Partial<CreateProjectTemplateProps>
): Promise<ProjectTemplate> {
  if (!id.trim()) {
    throw new Error('Template ID is required');
  }

  try {
    const template = await projectTemplateRepository.update(id, data);

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/template');

    return template;
  } catch (error) {
    console.error('Failed to update template:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update template');
  }
}

export async function getProjectTemplate(id: string): Promise<ProjectTemplate | null> {
  if (!id) {
    throw new Error('Template ID is required');
  }

  try {
    const template = await templateService.getTemplateById(id);
    if (!template || !isValidProjectTemplate(template)) {
      return null;
    }
    return template;
  } catch (error) {
    console.error('Failed to get template:', error);
    return null;
  }
}
