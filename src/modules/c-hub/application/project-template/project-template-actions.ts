'use server';

import { CreateProjectTemplateProps, ProjectTemplate, isValidProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { projectTemplateRepository } from '@/modules/c-hub/infrastructure/project-template/project-template-repository';
import { CreateProjectTemplateCommandHandler, UpdateProjectTemplateCommandHandler } from './project-template.command-handler';

// CQRS: Command UseCases
export async function createProjectTemplateCommand(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
  try {
    // 呼叫 Application Command Handler，確保寫入資料庫
    const template = await CreateProjectTemplateCommandHandler({
      ...data,
      priority: data.priority ?? 0,
    });
    if (!isValidProjectTemplate(template)) {
      throw new Error('無效的專案模板數據');
    }
    return template;
  } catch (error) {
    console.error('Failed to create template:', error);
    throw error instanceof Error ? error : new Error('Failed to create template');
  }
}

export async function deleteProjectTemplateCommand(id: string): Promise<void> {
  if (!id) throw new Error('Template ID is required');
  try {
    // 直接呼叫 repository 進行物理刪除
    await projectTemplateRepository.delete(id);
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
    // 呼叫 Application Command Handler
    const template = await UpdateProjectTemplateCommandHandler(id, {
      ...data,
      priority: data.priority ?? 0,
    });
    return template;
  } catch (error) {
    console.error('Failed to update template:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update template');
  }
}
