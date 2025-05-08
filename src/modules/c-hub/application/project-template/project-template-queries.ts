'use server';

import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/entities/project-template-entity';
import { projectTemplateRepository } from '@/modules/c-hub/infrastructure/project-template/project-template-repository';

export async function listProjectTemplates(): Promise<ProjectTemplate[]> {
  try {
    return await projectTemplateRepository.list();
  } catch (error) {
    console.error('獲取專案模板列表失敗:', error);
    return [];
  }
}

export async function getProjectTemplate(id: string): Promise<ProjectTemplate | null> {
  if (!id?.trim()) {
    throw new Error('專案模板 ID 不能為空');
  }

  try {
    return await projectTemplateRepository.getById(id);
  } catch (error) {
    console.error('獲取專案模板詳情失敗:', error);
    return null;
  }
}
