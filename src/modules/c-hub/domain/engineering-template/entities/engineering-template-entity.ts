/**
 * 工程模板實體 - 核心業務物件
 * 工程模板代表一組預定義的工程結構，可被重複應用於專案中
 */

import { EngineeringTemplateDescription } from '../value-objects/engineering-template-description.vo';
import { EngineeringTemplateName } from '../value-objects/engineering-template-name.vo';
import { EngineeringTemplatePriority } from '../value-objects/engineering-template-priority.vo';

/**
 * 工程模板基本實體 - 與資料庫結構對應
 */
export interface EngineeringTemplate {
    id: string;
    name: string;
    description: string | null;
    priority: number | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 建立工程模板的輸入資料
 */
export type CreateEngineeringTemplateProps = {
    name: string; // 必填欄位
    description?: string | null;
    priority?: number | null;
};

/**
 * 更新工程模板的輸入資料
 */
export type UpdateEngineeringTemplateProps = Partial<{
    name: string;
    description: string | null;
    priority: number | null;
}>;

/**
 * 從模板產生工程的輸入資料
 */
export interface CreateEngineeringFromTemplateProps {
    engineeringTemplateId: string;
    projectId: string;
    name?: string;
    description?: string | null;
    userId?: string;
    tasks?: { taskTemplateId: string; count: number; priority?: number }[];
}

/**
 * 豐富的領域模型 - 使用值物件
 */
export interface RichEngineeringTemplate {
    id: string;
    name: EngineeringTemplateName;
    description: EngineeringTemplateDescription;
    priority: EngineeringTemplatePriority;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 工程模板工廠 - 負責建立與驗證工程模板實體
 */
export class EngineeringTemplateFactory {
    /**
     * 從基本資料創建工程模板值物件結構
     * @param props 工程模板屬性
     */
    static create(props: CreateEngineeringTemplateProps): Partial<RichEngineeringTemplate> {
        return {
            name: EngineeringTemplateName.create(props.name),
            description: EngineeringTemplateDescription.create(props.description || null),
            priority: EngineeringTemplatePriority.create(props.priority)
        };
    }

    /**
     * 將資料庫實體轉換為豐富領域實體
     * @param entity 基本實體
     */
    static toRichModel(entity: EngineeringTemplate): RichEngineeringTemplate {
        return {
            id: entity.id,
            name: EngineeringTemplateName.create(entity.name),
            description: EngineeringTemplateDescription.create(entity.description),
            priority: EngineeringTemplatePriority.create(entity.priority),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    /**
     * 將豐富領域實體轉換為基本實體
     * @param richEntity 豐富領域實體
     */
    static toBasicModel(richEntity: RichEngineeringTemplate): EngineeringTemplate {
        return {
            id: richEntity.id,
            name: richEntity.name.getValue(),
            description: richEntity.description.getValue(),
            priority: richEntity.priority.getValue(),
            createdAt: richEntity.createdAt,
            updatedAt: richEntity.updatedAt
        };
    }
}

/**
 * 型別守衛 - 確保型別安全
 * @param template 需要驗證的對象
 */
export function isValidEngineeringTemplate(template: unknown): template is EngineeringTemplate {
    return (
        typeof template === 'object' &&
        template !== null &&
        'id' in template &&
        'name' in template &&
        'createdAt' in template &&
        'updatedAt' in template
    );
}

/**
 * 型別守衛 - 確保豐富模型型別安全
 * @param template 需要驗證的對象
 */
export function isValidRichEngineeringTemplate(template: unknown): template is RichEngineeringTemplate {
    return (
        typeof template === 'object' &&
        template !== null &&
        'id' in template &&
        'name' in template &&
        'description' in template &&
        'priority' in template &&
        'createdAt' in template &&
        'updatedAt' in template &&
        template.name instanceof EngineeringTemplateName &&
        template.description instanceof EngineeringTemplateDescription &&
        template.priority instanceof EngineeringTemplatePriority
    );
}