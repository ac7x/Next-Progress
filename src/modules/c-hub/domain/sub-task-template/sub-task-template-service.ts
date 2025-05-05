import { CreateSubTaskTemplateProps, SubTaskTemplate, UpdateSubTaskTemplateProps, isValidSubTaskTemplate } from './sub-task-template-entity';
import { SubTaskTemplateCreatedEvent, SubTaskTemplateDeletedEvent, SubTaskTemplateUpdatedEvent } from './sub-task-template-events';
import { ISubTaskTemplateRepository } from './sub-task-template-repository';

export class SubTaskTemplateDomainService {
  constructor(private readonly repository: ISubTaskTemplateRepository) { }

  async createTemplate(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate> {
    if (!data.name?.trim()) {
      throw new Error('子任務模板名稱不能為空');
    }

    if (!data.taskTemplateId?.trim()) {
      throw new Error('必須指定任務模板ID');
    }

    const template = await this.repository.create(data);

    if (!isValidSubTaskTemplate(template)) {
      throw new Error('儲存庫返回的子任務模板數據無效');
    }

    // 發布領域事件
    new SubTaskTemplateCreatedEvent(template.id, template.name, template.taskTemplateId);

    return template;
  }

  async updateTemplate(id: string, data: UpdateSubTaskTemplateProps): Promise<SubTaskTemplate> {
    if (!id?.trim()) {
      throw new Error('子任務模板ID不能為空');
    }

    const existingTemplate = await this.repository.getById(id);
    if (!existingTemplate) {
      throw new Error('找不到指定的子任務模板');
    }

    const updatedTemplate = await this.repository.update(id, data);

    if (!isValidSubTaskTemplate(updatedTemplate)) {
      throw new Error('儲存庫返回的更新子任務模板數據無效');
    }

    // 發布領域事件
    new SubTaskTemplateUpdatedEvent(updatedTemplate.id, updatedTemplate.name);

    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('子任務模板ID不能為空');
    }

    await this.repository.delete(id);

    // 發布領域事件
    new SubTaskTemplateDeletedEvent(id);
  }

  async getTemplateById(id: string): Promise<SubTaskTemplate | null> {
    if (!id?.trim()) {
      throw new Error('子任務模板ID不能為空');
    }
    return this.repository.getById(id);
  }

  async listTemplates(): Promise<SubTaskTemplate[]> {
    return this.repository.list();
  }

  async listTemplatesByTaskTemplateId(taskTemplateId: string): Promise<SubTaskTemplate[]> {
    if (!taskTemplateId?.trim()) {
      throw new Error('任務模板ID不能為空');
    }
    return this.repository.findByTaskTemplateId(taskTemplateId);
  }
}
