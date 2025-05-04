'use server';

import { CreateSubTaskTemplateProps, SubTaskTemplate, UpdateSubTaskTemplateProps } from '@/modules/c-hub/domain/sub-task-template/sub-task-template-entity';
import { createSubTaskTemplateCommand, deleteSubTaskTemplateCommand, updateSubTaskTemplateCommand } from './sub-taskTemplate.command';
// 以 Query 結尾作為 CQRS 查詢區分，避免命名衝突
import { getSubTaskTemplateQuery, listSubTaskTemplatesByTaskTemplateId as listSubTaskTemplatesByTaskTemplateIdQuery } from './sub-taskTemplate.query';

// UI Action: 建立子任務模板
export async function createSubTaskTemplate(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate> {
  return createSubTaskTemplateCommand(data);
}

// UI Action: 更新子任務模板
export async function updateSubTaskTemplate(id: string, data: UpdateSubTaskTemplateProps): Promise<SubTaskTemplate> {
  return updateSubTaskTemplateCommand(id, data);
}

// UI Action: 刪除子任務模板
export async function deleteSubTaskTemplate(id: string, taskTemplateId?: string): Promise<void> {
  return deleteSubTaskTemplateCommand(id, taskTemplateId);
}

// UI Action: 查詢單一子任務模板
export async function getSubTaskTemplate(id: string) {
  return getSubTaskTemplateQuery(id);
}

// UI Action: 查詢子任務模板清單（依任務模板）
export async function listSubTaskTemplatesByTaskTemplateId(taskTemplateId: string) {
  return listSubTaskTemplatesByTaskTemplateIdQuery(taskTemplateId);
}
