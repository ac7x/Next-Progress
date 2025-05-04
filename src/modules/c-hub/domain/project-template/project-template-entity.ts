// 只定義 Entity 與型別守衛
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  priority?: number | null; // 新增 priority 欄位
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectTemplateProps {
  name: string;
  description?: string | null;
  isActive?: boolean;
  priority?: number | null; // 新增 priority 欄位
}

// 添加型別守衛函數確保型別安全
export function isValidProjectTemplate(template: unknown): template is ProjectTemplate {
  return (
    typeof template === 'object' &&
    template !== null &&
    typeof (template as any).id === 'string' &&
    typeof (template as any).name === 'string' &&
    typeof (template as any).isActive === 'boolean' &&
    ((template as any).priority === undefined || typeof (template as any).priority === 'number' || (template as any).priority === null) && // 新增 priority 型別守衛
    (template as any).createdAt instanceof Date &&
    (template as any).updatedAt instanceof Date
  );
}
