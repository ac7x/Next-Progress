import { CreateProjectTemplateProps, ProjectTemplate } from './project-template-entity';
import { ProjectTemplateCreatedEvent, ProjectTemplateDeletedEvent, ProjectTemplateUpdatedEvent } from './project-template-events';
import { IProjectTemplateRepository } from './project-template-repository';

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
      priority: data.priority ?? 0, // 新增 priority
    };
    new ProjectTemplateCreatedEvent(id, data.name); // 發佈事件
    return projectTemplate;
  }

  update(
    id: string,
    name: string,
    description: string | null = null,
    priority: number | null = 0 // 新增 priority
  ): ProjectTemplate {
    const now = new Date();
    const updatedTemplate: ProjectTemplate = {
      id,
      name,
      description,
      priority: priority ?? 0, // 新增 priority
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
  constructor(private readonly repository: IProjectTemplateRepository) { }

  async createTemplate(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
    if (!data.name.trim()) {
      throw new Error('Template name cannot be empty');
    }

    const template = await this.repository.create({
      ...data,
      priority: data.priority ?? 0, // 新增 priority
    });

    // 發布領域事件
    new ProjectTemplateCreatedEvent(template.id, template.name);

    return template;
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.repository.delete(id);

    // 發布領域事件
    new ProjectTemplateDeletedEvent(id);
  }

  async getTemplateById(id: string): Promise<ProjectTemplate | null> {
    if (!id.trim()) {
      throw new Error('Template ID cannot be empty');
    }
    return this.repository.getById(id);
  }

  async listTemplates(): Promise<ProjectTemplate[]> {
    return this.repository.list();
  }

  async updateTemplate(id: string, data: Partial<CreateProjectTemplateProps>): Promise<ProjectTemplate> {
    if (!id.trim()) throw new Error('Template ID cannot be empty');
    if (data.name && !data.name.trim()) throw new Error('Template name cannot be empty');
    // 可加上更多業務規則
    return this.repository.update(id, {
      ...data,
      priority: data.priority ?? 0, // 新增 priority
    });
  }

  validateTemplate(template: Partial<ProjectTemplate>): void {
    if (!template.name?.trim()) {
      throw new Error('Template name cannot be empty');
    }
    if (template.name.length > 100) {
      throw new Error('Template name too long');
    }
  }
}
