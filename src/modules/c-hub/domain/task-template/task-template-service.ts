import { CreateTaskTemplateProps, TaskTemplate, UpdateTaskTemplateProps, isValidTaskTemplate } from './task-template-entity';
import { TaskTemplateCreatedEvent, TaskTemplateDeletedEvent, TaskTemplateUpdatedEvent } from './task-template-events';
import { ITaskTemplateRepository } from './task-template-repository';

export class TaskTemplateDomainService {
  constructor(private readonly repository: ITaskTemplateRepository) {}

  async createTemplate(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
    if (!data.name?.trim()) {
      throw new Error('任務模板名稱不能為空');
    }
    
    const template = await this.repository.create(data);
    
    if (!isValidTaskTemplate(template)) {
      throw new Error('儲存庫返回的任務模板數據無效');
    }
    
    // 發布領域事件
    new TaskTemplateCreatedEvent(template.id, template.name);
    
    return template;
  }

  async updateTemplate(id: string, data: UpdateTaskTemplateProps): Promise<TaskTemplate> {
    if (!id?.trim()) {
      throw new Error('任務模板ID不能為空');
    }

    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('任務模板名稱不能為空');
    }
    
    const template = await this.repository.update(id, data);
    
    // 發布領域事件
    new TaskTemplateUpdatedEvent(template.id, template.name);
    
    return template;
  }

  async deleteTemplate(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('任務模板ID不能為空');
    }
    
    try {
      // 先檢查模板是否存在
      const template = await this.repository.getById(id);
      if (!template) {
        throw new Error(`找不到ID為 ${id} 的任務模板，無法刪除`);
      }
      
      await this.repository.delete(id);
      
      // 發布領域事件
      new TaskTemplateDeletedEvent(id);
    } catch (error) {
      // 重新拋出錯誤，保留原始錯誤信息
      throw error;
    }
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
}
