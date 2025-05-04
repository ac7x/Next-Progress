// 只定義 Entity 與型別守衛
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectTemplateProps {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// 添加型別守衛函數確保型別安全
export function isValidProjectTemplate(template: unknown): template is ProjectTemplate {
  return (
    typeof template === 'object' &&
    template !== null &&
    'id' in template &&
    'name' in template &&
    'isActive' in template &&
    'createdAt' in template &&
    'updatedAt' in template
  );
}
