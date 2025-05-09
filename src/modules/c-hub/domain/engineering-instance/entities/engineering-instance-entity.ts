/**
 * 工程實例實體 - 核心業務物件
 * 工程實例代表專案中的實際工程，可能由工程模板生成或直接創建
 */

import { EngineeringInstanceDescription } from '../value-objects/engineering-instance-description.vo';
import { EngineeringInstanceName } from '../value-objects/engineering-instance-name.vo';

// 工程實例實體定義
export interface EngineeringInstance {
    id: string;
    name: EngineeringInstanceName;
    description: EngineeringInstanceDescription;
    projectId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// 原始資料轉換為領域實體所需的資料
export interface EngineeringInstanceRaw {
    id: string;
    name: string;
    description: string | null;
    projectId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// 建立工程實例的輸入資料
export interface CreateEngineeringInstanceProps {
    name: string;
    description?: string | null;
    projectId: string;
    userId?: string;
}

// 更新工程實例的輸入資料
export interface UpdateEngineeringInstanceProps {
    name?: string;
    description?: string | null;
}

// 工程實例工廠函數 - 負責建立工程實例實體
export const EngineeringInstanceFactory = {
    // 從原始資料創建領域實體
    create(raw: EngineeringInstanceRaw): EngineeringInstance {
        return {
            id: raw.id,
            name: EngineeringInstanceName.create(raw.name),
            description: EngineeringInstanceDescription.create(raw.description),
            projectId: raw.projectId,
            userId: raw.userId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };
    },

    // 將領域實體轉換為原始資料
    toRaw(entity: EngineeringInstance): EngineeringInstanceRaw {
        return {
            id: entity.id,
            name: entity.name.getValue(),
            description: entity.description.getValue(),
            projectId: entity.projectId,
            userId: entity.userId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
};

// 型別守衛函數確保型別安全
export function isValidEngineeringInstance(instance: unknown): instance is EngineeringInstance {
    return typeof instance === 'object' &&
        instance !== null &&
        'id' in instance &&
        'name' in instance &&
        'projectId' in instance &&
        'userId' in instance;
}