import { CreateTaskTemplateProps, TaskTemplate, TaskTemplateFactory, UpdateTaskTemplateProps, isValidTaskTemplate } from '../entities';
import { TaskTemplateCreatedEvent, TaskTemplateDeletedEvent, TaskTemplateUpdatedEvent } from '../events';
import { ITaskTemplateRepository } from '../repositories';

/**
 * 任務模板領域服務
 * 負責協調實體、值物件和存儲庫，實現業務邏輯
 */
export class TaskTemplateService {
    constructor(
        private readonly taskTemplateRepository: ITaskTemplateRepository
    ) { }

    /**
     * 創建新的任務模板
     * @param data 創建所需數據
     * @returns 創建的任務模板
     */
    async createTaskTemplate(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
        // 使用工廠方法創建豐富的領域實體
        const richTaskTemplate = TaskTemplateFactory.create(data);

        // 持久化到存儲層
        const createdTemplate = await this.taskTemplateRepository.create(data);

        // 觸發領域事件（在實際實現中可能會發送到事件總線）
        const event = new TaskTemplateCreatedEvent(
            createdTemplate.id,
            createdTemplate.name,
            createdTemplate.engineeringId
        );
        console.log(`領域事件: ${TaskTemplateCreatedEvent.eventName()}`, event);

        return createdTemplate;
    }

    /**
     * 獲取所有任務模板列表
     * @returns 任務模板列表
     */
    async listTaskTemplates(): Promise<TaskTemplate[]> {
        return this.taskTemplateRepository.list();
    }

    /**
     * 根據 ID 獲取任務模板
     * @param id 任務模板 ID
     * @returns 找到的任務模板或 null
     */
    async getTaskTemplateById(id: string): Promise<TaskTemplate | null> {
        return this.taskTemplateRepository.getById(id);
    }

    /**
     * 更新任務模板
     * @param id 任務模板 ID
     * @param data 更新數據
     * @returns 更新後的任務模板
     */
    async updateTaskTemplate(id: string, data: UpdateTaskTemplateProps): Promise<TaskTemplate> {
        // 先獲取現有任務模板
        const existingTemplate = await this.taskTemplateRepository.getById(id);
        if (!existingTemplate) {
            throw new Error(`任務模板不存在: ${id}`);
        }

        // 更新任務模板
        const updatedTemplate = await this.taskTemplateRepository.update(id, data);

        // 觸發領域事件
        const event = new TaskTemplateUpdatedEvent(
            updatedTemplate.id,
            updatedTemplate.name,
            updatedTemplate.engineeringId
        );
        console.log(`領域事件: ${TaskTemplateUpdatedEvent.eventName()}`, event);

        return updatedTemplate;
    }

    /**
     * 刪除任務模板
     * @param id 任務模板 ID
     */
    async deleteTaskTemplate(id: string): Promise<void> {
        // 先獲取現有任務模板
        const existingTemplate = await this.taskTemplateRepository.getById(id);
        if (!existingTemplate) {
            throw new Error(`任務模板不存在: ${id}`);
        }

        // 刪除任務模板
        await this.taskTemplateRepository.delete(id);

        // 觸發領域事件
        const event = new TaskTemplateDeletedEvent(id);
        console.log(`領域事件: ${TaskTemplateDeletedEvent.eventName()}`, event);
    }

    /**
     * 根據工程模板 ID 查找任務模板
     * @param engineeringTemplateId 工程模板 ID
     * @returns 相關的任務模板列表
     */
    async findByEngineeringTemplateId(engineeringTemplateId: string): Promise<TaskTemplate[]> {
        return this.taskTemplateRepository.findByEngineeringTemplateId(engineeringTemplateId);
    }
}

// 特殊命名：符合 DDD 規範的命名，表示領域服務
export class TaskTemplateDomainService {
    constructor(private readonly repository: ITaskTemplateRepository) { }

    /**
     * 創建任務模板
     * @param data 創建資料
     */
    async createTemplate(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
        // 業務驗證
        if (!data.name?.trim()) {
            throw new Error('任務模板名稱為必填項');
        }

        // 使用工廠方法創建豐富的領域實體
        const richTaskTemplate = TaskTemplateFactory.create(data);

        // 持久化到存儲層
        const createdTemplate = await this.repository.create({
            ...data,
            isActive: data.isActive ?? true,
        });

        if (!isValidTaskTemplate(createdTemplate)) {
            throw new Error('無效的任務模板數據');
        }

        // 觸發領域事件
        const event = new TaskTemplateCreatedEvent(
            createdTemplate.id,
            createdTemplate.name,
            createdTemplate.engineeringId
        );

        // 在實際生產環境中，這裡可以發布事件到事件總線
        console.log(`領域事件: ${TaskTemplateCreatedEvent.eventName()}`, event);

        return createdTemplate;
    }

    /**
     * 更新任務模板
     * @param id 任務模板ID
     * @param data 更新資料
     */
    async updateTemplate(id: string, data: UpdateTaskTemplateProps): Promise<TaskTemplate> {
        if (!id?.trim()) {
            throw new Error('任務模板ID不能為空');
        }

        // 檢查模板是否存在
        const existingTemplate = await this.repository.getById(id);
        if (!existingTemplate) {
            throw new Error(`任務模板不存在: ${id}`);
        }

        // 更新資料
        const updatedTemplate = await this.repository.update(id, data);

        // 觸發領域事件
        const event = new TaskTemplateUpdatedEvent(
            updatedTemplate.id,
            updatedTemplate.name,
            updatedTemplate.engineeringId
        );

        // 在實際生產環境中，這裡可以發布事件到事件總線
        console.log(`領域事件: ${TaskTemplateUpdatedEvent.eventName()}`, event);

        return updatedTemplate;
    }

    /**
     * 刪除任務模板
     * @param id 任務模板ID
     */
    async deleteTemplate(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new Error('任務模板ID不能為空');
        }

        // 檢查模板是否存在
        const template = await this.repository.getById(id);
        if (!template) {
            throw new Error(`任務模板不存在: ${id}`);
        }

        // 刪除模板
        await this.repository.delete(id);

        // 觸發領域事件
        const event = new TaskTemplateDeletedEvent(id);

        // 在實際生產環境中，這裡可以發布事件到事件總線
        console.log(`領域事件: ${TaskTemplateDeletedEvent.eventName()}`, event);
    }

    /**
     * 根據ID獲取任務模板
     * @param id 任務模板ID
     */
    async getTemplateById(id: string): Promise<TaskTemplate | null> {
        if (!id?.trim()) {
            throw new Error('任務模板ID不能為空');
        }
        return this.repository.getById(id);
    }

    /**
     * 獲取所有任務模板
     */
    async listTemplates(): Promise<TaskTemplate[]> {
        return this.repository.list();
    }

    /**
     * 根據工程模板ID查詢任務模板
     * @param engineeringTemplateId 工程模板ID
     */
    async findTemplatesByEngineeringId(engineeringTemplateId: string): Promise<TaskTemplate[]> {
        if (!engineeringTemplateId?.trim()) {
            throw new Error('工程模板ID不能為空');
        }
        return this.repository.findByEngineeringTemplateId(engineeringTemplateId);
    }
}