'use server';

import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { projectInstanceService } from '@/modules/c-hub/domain/project-instance/services/project-instance-service';

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
