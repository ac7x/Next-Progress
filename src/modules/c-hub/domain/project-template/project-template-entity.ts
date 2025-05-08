// 只定義 Entity 與型別守衛
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  priority: number; // 必為 number，不可 null
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectTemplateProps {
  name: string;
  description?: string | null;
  isActive?: boolean;
  priority?: number; // 可選，預設 0
}

// 型別守衛函數確保型別安全
export function isValidProjectTemplate(template: unknown): template is ProjectTemplate {
  return (
    typeof template === 'object' &&
    template !== null &&
    typeof (template as any).id === 'string' &&
    typeof (template as any).name === 'string' &&
    typeof (template as any).isActive === 'boolean' &&
    typeof (template as any).priority === 'number' && // 必須是 number
    (typeof (template as any).description === 'string' || (template as any).description === null) &&
    (template as any).createdAt instanceof Date &&
    (template as any).updatedAt instanceof Date
  );
}
