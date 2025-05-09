import { TaskTemplateName } from '../value-objects/task-template-name.vo';
import { TaskTemplatePriority } from '../value-objects/task-template-priority.vo';

// 任務模板實體定義
export interface TaskTemplate {
    id: string;
    name: TaskTemplateName; // 使用值物件
    description: string | null;
    engineeringId: string | null;
    priority: TaskTemplatePriority; // 使用值物件
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// 原始資料轉換為領域實體所需的資料
export interface TaskTemplateRaw {
    id: string;
    name: string;
    description: string | null;
    engineeringId: string | null;
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// 建立任務模板的輸入資料
export interface CreateTaskTemplateProps {
    name: string;
    description?: string | null;
    engineeringId?: string | null;
    priority?: number;
    isActive?: boolean;
}

// 更新任務模板的輸入資料
export interface UpdateTaskTemplateProps {
    name?: string;
    description?: string | null;
    engineeringId?: string | null;
    priority?: number;
    isActive?: boolean;
}

// 任務模板工廠函數 - 負責建立任務模板實體
export const TaskTemplateFactory = {
    // 從原始資料創建領域實體
    create(raw: TaskTemplateRaw): TaskTemplate {
        return {
            id: raw.id,
            name: new TaskTemplateName(raw.name),
            description: raw.description,
            engineeringId: raw.engineeringId,
            priority: new TaskTemplatePriority(raw.priority),
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
    },

    // 將領域實體轉換為原始資料
    toRaw(entity: TaskTemplate): TaskTemplateRaw {
        return {
            id: entity.id,
            name: entity.name.getValue(),
            description: entity.description,
            engineeringId: entity.engineeringId,
            priority: entity.priority.getValue(),
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    },
};

// 型別守衛函數確保型別安全
export function isValidTaskTemplate(template: unknown): template is TaskTemplate {
    return typeof template === 'object' &&
        template !== null &&
        'id' in template &&
        'name' in template &&
        'isActive' in template &&
        'createdAt' in template &&
        'updatedAt' in template;
}
