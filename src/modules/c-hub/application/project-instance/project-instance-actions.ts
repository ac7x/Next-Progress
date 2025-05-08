'use server';

import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { revalidatePath } from 'next/cache';
import { getProjectInstanceProgressSummary } from './project-instance-progress-summary-query';
import { projectInstanceService } from './project-instance-service';
import { CreateProjectInstanceFromTemplateCommandHandler } from './project-instance.command-handler';

export async function createProject(data: CreateProjectInstanceProps): Promise<ProjectInstance> {
  try {
    if (!data.name?.trim()) {
      throw new Error('專案名稱不能為空');
    }

    if (!data.createdBy?.trim()) {
      throw new Error('必須指定專案建立者');
    }

    const project = await projectInstanceService.create(data);

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/manage');
    revalidatePath('/client/dashboard');
    revalidatePath('/client/template'); // P46a3

    return project;
  } catch (error) {
    console.error('建立專案失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('建立專案失敗: ' + String(error));
  }
}

export async function createProjectFromTemplate(
  templateId: string,
  projectData: Omit<CreateProjectInstanceProps, 'templateId'>
): Promise<ProjectInstance> {
  if (!templateId?.trim()) {
    throw new Error('模板 ID 不能為空');
  }

  if (!projectData.name?.trim()) {
    throw new Error('專案名稱不能為空');
  }

  if (!projectData.createdBy?.trim()) {
    throw new Error('必須指定專案建立者');
  }

  try {
    // 由 Command Handler 處理
    const project = await CreateProjectInstanceFromTemplateCommandHandler(templateId, projectData);

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/manage');
    revalidatePath('/client/dashboard');
    revalidatePath('/client/template'); // P46a3

    return project;
  } catch (error) {
    console.error('從模板建立專案失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('從模板建立專案失敗: ' + String(error));
  }
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectInstanceProps>
): Promise<ProjectInstance> {
  if (!id?.trim()) {
    throw new Error('專案 ID 不能為空');
  }

  try {
    const project = await projectInstanceService.update(id, data);

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/manage');
    revalidatePath('/client/dashboard');
    revalidatePath('/client/template'); // P46a3

    return project;
  } catch (error) {
    console.error('更新專案失敗:', error);
    throw error instanceof Error ? error : new Error('更新專案失敗');
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (!id?.trim()) {
    throw new Error('專案 ID 不能為空');
  }

  try {
    await projectInstanceService.delete(id);

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/manage');
    revalidatePath('/client/dashboard');
    revalidatePath('/client/template'); // P46a3
  } catch (error) {
    console.error('刪除專案失敗:', error);
    throw error instanceof Error ? error : new Error('刪除專案失敗');
  }
}

export const getProjectInstanceProgressSummaryAction = async (projectInstanceId: string) => {
  'use server';
  return getProjectInstanceProgressSummary(projectInstanceId);
};
