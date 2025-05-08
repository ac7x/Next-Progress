import { CreateProjectTemplateProps, ProjectTemplate } from '../entities/project-template-entity';
import { ProjectTemplateCreatedEvent, ProjectTemplateDeletedEvent, ProjectTemplateUpdatedEvent } from '../events/project-template-events';
import { ProjectTemplateDescription } from '../value-objects/project-template-description.vo';
import { ProjectTemplateName } from '../value-objects/project-template-name.vo';
import { ProjectTemplatePriority } from '../value-objects/project-template-priority.vo';

// 只負責領域邏輯與驗證
export class ProjectTemplateService {
  create(data: Omit<ProjectTemplate, 'id' | 'createdAt' | 'updatedAt'>): ProjectTemplate {
    const id = crypto.randomUUID();
    const now = new Date();
    const projectTemplate: ProjectTemplate = {
      id,
      createdAt: now,
      updatedAt: now,
      ...data,
      priority: data.priority ?? 0,
    };
    new ProjectTemplateCreatedEvent(id, data.name); // 發佈事件
    return projectTemplate;
  }

  update(
    id: string,
    name: ProjectTemplateName,
    description: ProjectTemplateDescription = null,
    priority: ProjectTemplatePriority | null = 0
  ): ProjectTemplate {
    const now = new Date();
    const updatedTemplate: ProjectTemplate = {
      id,
      name,
      description,
      priority: priority ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    new ProjectTemplateUpdatedEvent(id, name); // 發佈更新事件
    return updatedTemplate;
  }

  delete(id: string): void {
    new ProjectTemplateDeletedEvent(id); // 發佈刪除事件
  }
}


export class ProjectTemplateDomainService {
  validateTemplate(data: Partial<CreateProjectTemplateProps>) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      throw new Error('專案模板名稱不能為空');
    }
    // 可擴充更多領域驗證
  }
}
