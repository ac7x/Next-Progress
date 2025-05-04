import {
    CreateEngineeringTemplateProps,
    EngineeringTemplate,
    UpdateEngineeringTemplateProps,
    isValidEngineeringTemplate
} from './engineering-template-entity';
import {
    EngineeringTemplateCreatedEvent,
    EngineeringTemplateDeletedEvent,
    EngineeringTemplateUpdatedEvent
} from './engineering-template-events';
import { IEngineeringTemplateRepository } from './engineering-template-repository';

export class EngineeringTemplateDomainService {
  constructor(private readonly repository: IEngineeringTemplateRepository) {}

  async createTemplate(data: CreateEngineeringTemplateProps): Promise<EngineeringTemplate> {
    this.validateCreate(data);
    
    const template = await this.repository.create({
      ...data
    });

    if (!isValidEngineeringTemplate(template)) {
      throw new Error('Invalid template data returned from repository');
    }

    new EngineeringTemplateCreatedEvent(template.id, template.name);
    return template;
  }

  async updateTemplate(
    id: string,
    data: UpdateEngineeringTemplateProps
  ): Promise<EngineeringTemplate> {
    if (!id?.trim()) {
      throw new Error('工程模板 ID 不能為空');
    }

    this.validateTemplate(data);
    const template = await this.repository.update(id, data);
    new EngineeringTemplateUpdatedEvent(template.id, template.name);
    return template;
  }

  async deleteTemplate(id: string): Promise<void> {
    if (!id || !id.trim()) {
      throw new Error('工程模板 ID 不能為空');
    }
    
    try {
      // 先檢查模板是否存在
      const template = await this.repository.getById(id);
      if (!template) {
        throw new Error(`找不到ID為 ${id} 的工程模板，無法刪除`);
      }
      
      await this.repository.delete(id);
      new EngineeringTemplateDeletedEvent(id);
    } catch (error) {
      // 重新拋出錯誤，保留原始錯誤信息
      throw error;
    }
  }

  async getTemplateById(id: string): Promise<EngineeringTemplate | null> {
    if (!id.trim()) {
      throw new Error('Template ID cannot be empty');
    }
    return this.repository.getById(id);
  }

  async listTemplates(): Promise<EngineeringTemplate[]> {
    return this.repository.list();
  }

  private validateCreate(data: CreateEngineeringTemplateProps): void {
    if (!data.name?.trim()) {
      throw new Error('工程模板名稱不能為空');
    }

    if (data.name.length > 100) {
      throw new Error('工程模板名稱不能超過100個字符');
    }
  }

  private validateTemplate(template: Partial<CreateEngineeringTemplateProps>): void {
    if (template.name !== undefined && !template.name.trim()) {
      throw new Error('工程模板名稱不能為空');
    }

    if (template.name && template.name.length > 100) {
      throw new Error('工程模板名稱不能超過100個字符');
    }
  }
}
