import { ProjectTemplateDescription } from '../value-objects/project-template-description.vo';
import { ProjectTemplateName } from '../value-objects/project-template-name.vo';
import { ProjectTemplatePriority } from '../value-objects/project-template-priority.vo';

export interface ProjectTemplate {
  id: string;
  name: ProjectTemplateName;
  description: ProjectTemplateDescription;
  priority: ProjectTemplatePriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectTemplateProps {
  name: ProjectTemplateName;
  description?: ProjectTemplateDescription;
  priority?: ProjectTemplatePriority;
}

// 型別守衛函數確保型別安全
export function isValidProjectTemplate(template: unknown): template is ProjectTemplate {
  return (
    typeof template === 'object' &&
    template !== null &&
    typeof (template as any).id === 'string' &&
    typeof (template as any).name === 'string' &&
    typeof (template as any).priority === 'number' && // 必須是 number
    (typeof (template as any).description === 'string' || (template as any).description === null) &&
    (template as any).createdAt instanceof Date &&
    (template as any).updatedAt instanceof Date
  );
}
