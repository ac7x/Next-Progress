/**
 * 工程模板領域服務 - 負責工程模板的業務邏輯
 * 處理不適合放在實體或值物件中的業務規則，特別是涉及多個實體間協調的邏輯
 */

import {
    CreateEngineeringTemplateProps,
    EngineeringTemplate,
    UpdateEngineeringTemplateProps,
    isValidEngineeringTemplate
} from '../entities/engineering-template-entity';
import {
    EngineeringTemplateCreatedEvent,
    EngineeringTemplateDeletedEvent,
    EngineeringTemplateUpdatedEvent
} from '../events/engineering-template-events';
import { IEngineeringTemplateRepository } from '../repositories/engineering-template-repository';

/**
 * 工程模板領域服務，負責工程模板業務邏輯與驗證
 */
export class EngineeringTemplateDomainService {
    constructor(private readonly repository: IEngineeringTemplateRepository) { }

    /**
     * 創建工程模板
     * @param data 工程模板創建資料
     * @returns 新創建的工程模板
     */
    async createTemplate(data: CreateEngineeringTemplateProps): Promise<EngineeringTemplate> {
        this.validateCreate(data);

        const template = await this.repository.create({
            ...data
        });

        if (!isValidEngineeringTemplate(template)) {
            throw new Error('無效的工程模板資料');
        }

        // 發布工程模板創建事件
        new EngineeringTemplateCreatedEvent(
            template.id,
            template.name.getValue()
        );

        return template;
    }

    /**
     * 更新工程模板
     * @param id 模板ID
     * @param data 需要更新的資料
     * @returns 更新後的工程模板
     */
    async updateTemplate(
        id: string,
        data: UpdateEngineeringTemplateProps
    ): Promise<EngineeringTemplate> {
        if (!id?.trim()) {
            throw new Error('工程模板 ID 不能為空');
        }

        this.validateTemplate(data);
        const template = await this.repository.update(id, data);

        // 發布工程模板更新事件
        new EngineeringTemplateUpdatedEvent(
            template.id,
            template.name.getValue()
        );

        return template;
    }

    /**
     * 刪除工程模板
     * @param id 模板ID
     */
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

            // 發布工程模板刪除事件
            new EngineeringTemplateDeletedEvent(id);
        } catch (error) {
            // 重新拋出錯誤，保留原始錯誤信息
            throw error;
        }
    }

    /**
     * 根據ID獲取工程模板
     * @param id 模板ID
     * @returns 工程模板或null
     */
    async getTemplateById(id: string): Promise<EngineeringTemplate | null> {
        if (!id.trim()) {
            throw new Error('工程模板 ID 不能為空');
        }
        return this.repository.getById(id);
    }

    /**
     * 獲取所有工程模板
     * @returns 工程模板列表
     */
    async listTemplates(): Promise<EngineeringTemplate[]> {
        return this.repository.list();
    }

    /**
     * 驗證創建模板的輸入資料
     * @param data 創建資料
     */
    private validateCreate(data: CreateEngineeringTemplateProps): void {
        if (!data.name?.trim()) {
            throw new Error('工程模板名稱不能為空');
        }

        if (data.name.length > 100) {
            throw new Error('工程模板名稱不能超過100個字符');
        }
    }

    /**
     * 驗證更新模板的輸入資料
     * @param template 更新資料
     */
    private validateTemplate(template: Partial<CreateEngineeringTemplateProps>): void {
        if (template.name !== undefined && !template.name.trim()) {
            throw new Error('工程模板名稱不能為空');
        }

        if (template.name && template.name.length > 100) {
            throw new Error('工程模板名稱不能超過100個字符');
        }
    }
}