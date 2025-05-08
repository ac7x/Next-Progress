export interface EngineeringTemplate {
  id: string;
  name: string;
  description: string | null;
  priority?: number | null; // 新增
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEngineeringTemplateProps = {
  name: string;  // 必填欄位
  description?: string | null;
  priority?: number | null; // 新增
};

export type UpdateEngineeringTemplateProps = Partial<
  Omit<EngineeringTemplate, 'id' | 'createdAt' | 'updatedAt'>
>;

// 改進型別守衛函數
export function isValidEngineeringTemplate(template: unknown): template is EngineeringTemplate {
  return typeof template === 'object' &&
    template !== null &&
    'id' in template &&
    'name' in template &&
    'createdAt' in template &&
    'updatedAt' in template;
}

export interface CreateEngineeringFromTemplateProps {
  engineeringTemplateId: string;
  projectId: string;
  name?: string;
  description?: string | null;
  userId?: string; // 確保包含 userId 屬性
  tasks?: { taskTemplateId: string; count: number }[]; // 新增：任務數量資訊
}
