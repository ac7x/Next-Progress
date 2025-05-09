/**
 * 工程模板儲存庫介面 - 定義領域與持久化層的交互方式
 * 遵循依賴反轉原則，領域層只依賴於抽象介面，不依賴於具體實現
 */

import { CreateEngineeringTemplateProps, EngineeringTemplate, UpdateEngineeringTemplateProps } from '../entities/engineering-template.entity';

export interface IEngineeringTemplateRepository {
    // 創建工程模板
    create(data: CreateEngineeringTemplateProps): Promise<EngineeringTemplate>;

    // 獲取所有工程模板
    list(): Promise<EngineeringTemplate[]>;

    // 根據 ID 獲取工程模板
    getById(id: string): Promise<EngineeringTemplate | null>;

    // 更新工程模板
    update(id: string, data: UpdateEngineeringTemplateProps): Promise<EngineeringTemplate>;

    // 刪除工程模板
    delete(id: string): Promise<void>;
}