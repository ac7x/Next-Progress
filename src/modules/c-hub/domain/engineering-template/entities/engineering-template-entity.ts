/**
 * 工程模板實體 - 核心業務物件
 * 工程模板代表一組預定義的工程結構，可被重複應用於專案中
 */

import { EngineeringTemplateDescription } from '../value-objects/engineering-template-description.vo';
import { EngineeringTemplateName } from '../value-objects/engineering-template-name.vo';
import { EngineeringTemplatePriority } from '../value-objects/engineering-template-priority.vo';

// 工程模板實體
export interface EngineeringTemplate {
    id: string;
    name: EngineeringTemplateName;
    description: EngineeringTemplateDescription;
    priority: EngineeringTemplatePriority;
    createdAt: Date;
    updatedAt: Date;
}

// 原始資料轉換為領域實體所需的資料
export interface EngineeringTemplateRaw {
    id: string;
    name: string;
    description: string | null;
    priority?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

// 建立工程模板的輸入資料
export type CreateEngineeringTemplateProps = {
    name: string; // 必填欄位
    description?: string | null;
    priority?: number | null;
};

// 更新工程模板的輸入資料
export type UpdateEngineeringTemplateProps = Partial<{
    name: string;
    description: string | null;
    priority: number | null;
}>;

// 從模板產生工程的輸入資料
export interface CreateEngineeringFromTemplateProps {
    engineeringTemplateId: string;
    projectId: string;
    name?: string;
    description?: string | null;
    userId?: string;
    tasks?: { taskTemplateId: string; count: number }[]; // 任務數量資訊
}

// 工程模板工廠函數 - 負責建立工程模板實體
export const EngineeringTemplateFactory = {
    // 從原始資料創建領域實體
    create(raw: EngineeringTemplateRaw): EngineeringTemplate {
        return {
            id: raw.id,
            name: EngineeringTemplateName.create(raw.name),
            description: EngineeringTemplateDescription.create(raw.description),
            priority: EngineeringTemplatePriority.create(raw.priority),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };
    },

    // 將領域實體轉換為原始資料
    toRaw(entity: EngineeringTemplate): EngineeringTemplateRaw {
        return {
            id: entity.id,
            name: entity.name.getValue(),
            description: entity.description.getValue(),
            priority: entity.priority.getValue(),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
};

// 型別守衛函數確保型別安全
export function isValidEngineeringTemplate(template: unknown): template is EngineeringTemplate {
    return typeof template === 'object' &&
        template !== null &&
        'id' in template &&
        'name' in template &&
        'description' in template &&
        'priority' in template &&
        'createdAt' in template &&
        'updatedAt' in template;
}