/**
 * 工程模板儲存庫介面 - 定義領域與持久化層的交互方式
 * 遵循依賴反轉原則，領域層只依賴於抽象介面，不依賴於具體實現
 */

import {
    CreateEngineeringTemplateProps,
    EngineeringTemplate,
    UpdateEngineeringTemplateProps
} from '../entities/engineering-template-entity';

export interface IEngineeringTemplateRepository {
    /**
     * 創建工程模板
     * @param data 工程模板創建資料
     * @returns 創建的工程模板實體
     */
    create(data: CreateEngineeringTemplateProps): Promise<EngineeringTemplate>;

    /**
     * 獲取所有工程模板
     * @returns 工程模板列表
     */
    list(): Promise<EngineeringTemplate[]>;

    /**
     * 根據ID獲取工程模板
     * @param id 工程模板ID
     * @returns 工程模板實體或null
     */
    getById(id: string): Promise<EngineeringTemplate | null>;

    /**
     * 更新工程模板
     * @param id 工程模板ID
     * @param data 需要更新的資料
     * @returns 更新後的工程模板實體
     */
    update(id: string, data: UpdateEngineeringTemplateProps): Promise<EngineeringTemplate>;

    /**
     * 刪除工程模板
     * @param id 工程模板ID
     */
    delete(id: string): Promise<void>;
}