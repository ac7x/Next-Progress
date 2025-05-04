'use server';

import { CreateProjectTemplateProps, ProjectTemplate, isValidProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectTemplateDomainService } from '@/modules/c-hub/domain/project-template/project-template-service';
import { projectTemplateRepository } from '@/modules/c-hub/infrastructure/project-template/project-template-repository';
import { revalidatePath } from 'next/cache';

// CQRS: Command UseCases
export async function createProjectTemplateCommand(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
  try {
    if (!data.name.trim()) {
      throw new Error('Template name is required');
    }
    const templateService = new ProjectTemplateDomainService(projectTemplateRepository);
    const template = await templateService.createTemplate({
      ...data,
      isActive: data.isActive ?? true,
    });
    if (!isValidProjectTemplate(template)) {
      throw new Error('無效的專案模板數據');
    }
    revalidatePath('/client/template');
    return template;
  } catch (error) {
    console.error('Failed to create template:', error);
    throw error instanceof Error ? error : new Error('Failed to create template');
  }
}

export async function deleteProjectTemplateCommand(id: string): Promise<void> {
  if (!id) throw new Error('Template ID is required');
  try {
    const templateService = new ProjectTemplateDomainService(projectTemplateRepository);
    await templateService.deleteTemplate(id);
    revalidatePath('/client/template');
  } catch (error) {
    console.error('Failed to delete template:', error);
    throw error instanceof Error ? error : new Error('Failed to delete template');
  }
}

export async function updateProjectTemplateCommand(
  id: string,
  data: Partial<CreateProjectTemplateProps>
): Promise<ProjectTemplate> {
  if (!id.trim()) throw new Error('Template ID is required');
  try {
    const template = await projectTemplateRepository.update(id, data);
    revalidatePath('/client/template');
    return template;
  } catch (error) {
    console.error('Failed to update template:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update template');
  }
}

// CQRS: Query UseCases
export async function listProjectTemplatesQuery(): Promise<ProjectTemplate[]> {
  try {
    const templateService = new ProjectTemplateDomainService(projectTemplateRepository);
    const templates = await templateService.listTemplates();
    return templates.filter(isValidProjectTemplate);
  } catch (error) {
    console.error('Failed to list templates:', error);
    return [];
  }
}

export async function getProjectTemplateQuery(id: string): Promise<ProjectTemplate | null> {
  if (!id) throw new Error('Template ID is required');
  try {
    const templateService = new ProjectTemplateDomainService(projectTemplateRepository);
    const template = await templateService.getTemplateById(id);
    if (!template || !isValidProjectTemplate(template)) return null;
    return template;
  } catch (error) {
    console.error('Failed to get template:', error);
    return null;
  }
}
