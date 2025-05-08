import { CreateProjectTemplateProps, ProjectTemplate } from './project-template-entity';
import { ProjectTemplateCreatedEvent, ProjectTemplateDeletedEvent, ProjectTemplateUpdatedEvent } from './project-template-events';

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
    name: string,
    description: string | null = null,
    priority: number | null = 0
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

// 只負責領域邏輯與驗證
export class ProjectTemplateDomainService {
  async createTemplate(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
    if (!data.name.trim()) {
      throw new Error('Template name cannot be empty');
    }
    // 僅產生領域物件，不寫入資料庫
    const template: ProjectTemplate = {
      id: '', // 由 repository 實際產生
      name: data.name,
      description: data.description ?? null,
      priority: data.priority ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    new ProjectTemplateCreatedEvent(template.id, template.name);
    return template;
  }

  async deleteTemplate(id: string): Promise<void> {
    if (!id.trim()) {
      throw new Error('Template ID cannot be empty');
    }
    // 發布領域事件
    new ProjectTemplateDeletedEvent(id);
  }

  async getTemplateById(id: string): Promise<ProjectTemplate | null> {
    if (!id.trim()) {
      throw new Error('Template ID cannot be empty');
    }
    // 模擬從儲存庫獲取模板
    return null;
  }

  async listTemplates(): Promise<ProjectTemplate[]> {
    // 模擬從儲存庫獲取模板列表
    return [];
  }

  async updateTemplate(id: string, data: Partial<CreateProjectTemplateProps>): Promise<ProjectTemplate> {
    if (!id.trim()) throw new Error('Template ID cannot be empty');
    if (data.name && !data.name.trim()) throw new Error('Template name cannot be empty');
    // 可加上更多業務規則
    const updatedTemplate: ProjectTemplate = {
      id,
      name: data.name ?? 'Default Name',
      description: data.description ?? null,
      priority: data.priority ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // 發布領域事件
    new ProjectTemplateUpdatedEvent(updatedTemplate.id, updatedTemplate.name);
    return updatedTemplate;
  }

  validateTemplate(template: Partial<ProjectTemplate> | Partial<CreateProjectTemplateProps>): void {
    if ('name' in template && !template.name?.trim()) {
      throw new Error('Template name cannot be empty');
    }
    if (template.name && template.name.length > 100) {
      throw new Error('Template name too long');
    }
  }
}
