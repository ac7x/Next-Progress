'use server';

import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { revalidatePath } from 'next/cache';
import { projectInstanceService } from './project-instance-service';

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
    const project = await projectInstanceService.createFromTemplate(templateId, projectData);

    // 確保在數據修改後重新驗證頁面數據
    revalidatePath('/client/manage');
    revalidatePath('/client/dashboard');

    return project;
  } catch (error) {
    console.error('從模板建立專案失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('從模板建立專案失敗: ' + String(error));
  }
}

export async function listProjects(): Promise<ProjectInstance[]> {
  try {
    return await projectInstanceService.list();
  } catch (error) {
    console.error('獲取專案列表失敗:', error);
    // 發生異常才回傳空陣列，UI 層根據長度判斷是否顯示「目前沒有專案」
    return [];
  }
}

export async function getProject(id: string): Promise<ProjectInstance | null> {
  if (!id?.trim()) {
    throw new Error('專案 ID 不能為空');
  }

  try {
    return await projectInstanceService.getById(id);
  } catch (error) {
    console.error('獲取專案詳情失敗:', error);
    return null;
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
  } catch (error) {
    console.error('刪除專案失敗:', error);
    throw error instanceof Error ? error : new Error('刪除專案失敗');
  }
}
