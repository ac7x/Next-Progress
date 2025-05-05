export interface SubTaskTemplate {
  id: string;
  name: string;
  description: string | null;
  plannedStart: Date | null;
  plannedEnd: Date | null;
  equipmentCount: number | null;
  priority: number;
  status: string;
  completionRate: number;
  isMandatory: boolean; // 添加必要字段
  orderIndex: number; // 添加必要字段
  parentTemplateId: string | null;
  taskTemplateId: string; // 存储关联的任务模板ID
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubTaskTemplateProps {
  name: string;
  description?: string | null;
  plannedStart?: Date | null;
  plannedEnd?: Date | null;
  equipmentCount?: number | null;
  taskTemplateId: string; // 用於建立關聯
  priority?: number;
  status?: string;
  completionRate?: number;
  isMandatory?: boolean; // 添加必要字段
  orderIndex?: number; // 添加必要字段
  parentTemplateId?: string | null;
}

export type UpdateSubTaskTemplateProps = Partial<CreateSubTaskTemplateProps>;

// 型別守衛函數
export function isValidSubTaskTemplate(template: unknown): template is SubTaskTemplate {
  return typeof template === 'object' &&
    template !== null &&
    'id' in template &&
    'name' in template &&
    'taskTemplateId' in template &&
    'isMandatory' in template && // 添加检查
    'orderIndex' in template && // 添加检查
    'createdAt' in template &&
    'updatedAt' in template;
}
