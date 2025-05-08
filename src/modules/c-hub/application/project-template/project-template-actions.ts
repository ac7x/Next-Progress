'use server';

import { CreateProjectTemplateProps, ProjectTemplate, isValidProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectTemplateDomainService } from '@/modules/c-hub/domain/project-template/project-template-service';
import { revalidatePath } from 'next/cache';
import { UpdateProjectTemplateCommandHandler } from './project-template.command-handler';

// 只負責 Application UseCase（Command）

// CQRS: Command UseCases
export async function createProjectTemplateCommand(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
  try {
    if (!data.name.trim()) {
      throw new Error('Template name is required');
    }
    const templateService = new ProjectTemplateDomainService(); // 不傳 repository
    const template = await templateService.createTemplate({
      ...data,
      isActive: data.isActive ?? true,
      priority: data.priority ?? 0, // 新增 priority
    });
    if (!isValidProjectTemplate(template)) {
      throw new Error('無效的專案模板數據');
    }
    revalidatePath('/client/template'); // 只在 Command Action 執行
    revalidatePath('/client/manage'); // P65bd
    return template;
  } catch (error) {
    console.error('Failed to create template:', error);
    throw error instanceof Error ? error : new Error('Failed to create template');
  }
}

export async function deleteProjectTemplateCommand(id: string): Promise<void> {
  if (!id) throw new Error('Template ID is required');
  try {
    const templateService = new ProjectTemplateDomainService(); // 不傳 repository
    await templateService.deleteTemplate(id);
    revalidatePath('/client/template'); // 只在 Command Action 執行
    revalidatePath('/client/manage'); // P65bd
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
    // 委派給 Application Command Handler（CQRS: Command）
    const template = await UpdateProjectTemplateCommandHandler(id, {
      ...data,
      priority: data.priority ?? 0,
    });
    revalidatePath('/client/template'); // 只在 Command Action 執行
    revalidatePath('/client/manage'); // P65bd
    return template;
  } catch (error) {
    console.error('Failed to update template:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update template');
  }
}
