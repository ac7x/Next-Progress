import { CreateTaskTemplateProps, TaskTemplate, UpdateTaskTemplateProps, isValidTaskTemplate } from './task-template-entity';
import { TaskTemplateCreatedEvent, TaskTemplateDeletedEvent, TaskTemplateUpdatedEvent } from './task-template-events';
import { ITaskTemplateRepository } from './task-template-repository';

export class TaskTemplateDomainService {
  constructor(private readonly repository: ITaskTemplateRepository) { }

  async createTemplate(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
    if (!data.name?.trim()) {
      throw new Error('任務模板名稱不能為空');
    }

    // 創建模板，確保所需屬性都存在
    const template = await this.repository.create({
      ...data,
      priority: data.priority ?? 0,
    });

    // 發布領域事件
    new TaskTemplateCreatedEvent(template.id, template.name);

    return template;
  }

  async updateTemplate(id: string, data: UpdateTaskTemplateProps): Promise<TaskTemplate> {
    if (!id?.trim()) {
      throw new Error('任務模板 ID 不能為空');
    }

    // 檢查模板是否存在
    const existingTemplate = await this.repository.getById(id);
    if (!existingTemplate) {
      throw new Error('找不到指定的任務模板');
    }

    // 更新模板
    const updatedTemplate = await this.repository.update(id, data);

    // 確認更新成功且數據有效
    if (!isValidTaskTemplate(updatedTemplate)) {
      throw new Error('更新後的任務模板數據無效');
    }

    // 發布領域事件
    new TaskTemplateUpdatedEvent(updatedTemplate.id, updatedTemplate.name);

    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('任務模板 ID 不能為空');
    }

    await this.repository.delete(id);

    // 發布領域事件
    new TaskTemplateDeletedEvent(id);
  }

  async getTemplateById(id: string): Promise<TaskTemplate | null> {
    if (!id?.trim()) {
      throw new Error('任務模板ID不能為空');
    }
    return this.repository.getById(id);
  }

  async listTemplates(): Promise<TaskTemplate[]> {
    return this.repository.list();
  }

  // 新增方法：根據工程模板ID查詢任務模板
  async findTaskTemplatesByEngineeringTemplateId(engineeringTemplateId: string): Promise<TaskTemplate[]> {
    if (!engineeringTemplateId?.trim()) {
      throw new Error('工程模板ID不能為空');
    }
    return this.repository.findByEngineeringTemplateId(engineeringTemplateId);
  }
}
