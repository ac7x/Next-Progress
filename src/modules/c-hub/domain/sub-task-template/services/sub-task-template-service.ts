import { CreateSubTaskTemplateProps, SubTaskTemplate, UpdateSubTaskTemplateProps, isValidSubTaskTemplate } from '../entities/sub-task-template-entity';
import { SubTaskTemplateCreatedEvent, SubTaskTemplateDeletedEvent, SubTaskTemplateUpdatedEvent } from '../events/index';
import { ISubTaskTemplateRepository } from '../repositories/sub-task-template-repository-interface';

export class SubTaskTemplateService {
    constructor(private readonly repository: ISubTaskTemplateRepository) { }

    async createTemplate(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate> {
        if (!data.name?.trim()) {
            throw new Error('子任務模板名稱不能為空');
        }

        if (!data.taskTemplateId?.trim()) {
            throw new Error('必須指定任務模板ID');
        }

        if (data.parentTemplateId && !data.parentTemplateId.trim()) {
            throw new Error('父模板ID不能為空');
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

        if (data.name !== undefined && !data.name.trim()) {
            throw new Error('子任務模板名稱不能為空');
        }

        if (data.parentTemplateId && !data.parentTemplateId.trim()) {
            throw new Error('父模板ID不能為空');
        }

        const template = await this.repository.update(id, data);

        // 發布領域事件
        new SubTaskTemplateUpdatedEvent(template.id, template.name);

        return template;
    }

    async deleteTemplate(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new Error('子任務模板ID不能為空');
        }

        try {
            // 先檢查模板是否存在
            const template = await this.repository.getById(id);
            if (!template) {
                throw new Error(`找不到ID為 ${id} 的子任務模板，無法刪除`);
            }

            await this.repository.delete(id);

            // 發布領域事件
            new SubTaskTemplateDeletedEvent(id);
        } catch (error) {
            // 重新拋出錯誤，保留原始錯誤信息
            throw error;
        }
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