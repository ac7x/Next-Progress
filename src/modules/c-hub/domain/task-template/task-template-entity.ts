export interface TaskTemplate {
  id: string;
  name: string;
  description: string | null;
  engineeringId: string | null;
  priority: number; // 改為數字類型
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskTemplateProps {
  name: string;
  description?: string | null;
  engineeringId?: string | null;
  priority?: number; // 改為數字類型
}

export type UpdateTaskTemplateProps = Partial<CreateTaskTemplateProps>;

// 改進型別守衛函數
export function isValidTaskTemplate(template: unknown): template is TaskTemplate {
  return typeof template === 'object' &&
    template !== null &&
    'id' in template &&
    'name' in template &&
    'createdAt' in template &&
    'updatedAt' in template;
}
