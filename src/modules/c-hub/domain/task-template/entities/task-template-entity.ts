import {
    TaskTemplateDescription,
    TaskTemplateName,
    TaskTemplatePriority,
    TaskTemplateStatus
} from '../value-objects';

/**
 * 任務模板實體接口定義
 */
export interface TaskTemplate {
    id: string;
    name: string;
    description: string | null;
    engineeringId: string | null;
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 建立任務模板的輸入資料接口
 */
export interface CreateTaskTemplateProps {
    name: string;
    description?: string | null;
    engineeringId?: string | null;
    priority?: number;
    isActive?: boolean;
}

/**
 * 更新任務模板的輸入資料接口
 */
export type UpdateTaskTemplateProps = Partial<CreateTaskTemplateProps>;

/**
 * 豐富的任務模板領域模型
 * 使用值物件提供更豐富的業務語義與約束
 */
export interface RichTaskTemplate {
    id: string;
    name: TaskTemplateName;
    description: TaskTemplateDescription;
    engineeringId: string | null;
    priority: TaskTemplatePriority;
    status: TaskTemplateStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 任務模板工廠 - 負責建立與驗證任務模板實體
 */
export class TaskTemplateFactory {
    /**
     * 從基本資料創建豐富領域模型
     * @param props 任務模板屬性
     */
    static create(props: CreateTaskTemplateProps): Partial<RichTaskTemplate> {
        return {
            name: new TaskTemplateName(props.name),
            description: new TaskTemplateDescription(props.description ?? null),
            engineeringId: props.engineeringId || null,
            priority: new TaskTemplatePriority(props.priority),
            status: new TaskTemplateStatus(props.isActive ? 'active' : 'inactive'),
            isActive: props.isActive ?? true
        };
    }

    /**
     * 將資料庫實體轉換為豐富領域實體
     * @param entity 基本實體
     */
    static toRichModel(entity: TaskTemplate): RichTaskTemplate {
        return {
            id: entity.id,
            name: new TaskTemplateName(entity.name),
            description: new TaskTemplateDescription(entity.description),
            engineeringId: entity.engineeringId,
            priority: new TaskTemplatePriority(entity.priority),
            status: new TaskTemplateStatus(entity.isActive ? 'active' : 'inactive'),
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    /**
     * 將豐富領域實體轉換為基本實體
     * @param richEntity 豐富領域實體
     */
    static toBasicModel(richEntity: RichTaskTemplate): TaskTemplate {
        return {
            id: richEntity.id,
            name: richEntity.name.getValue(),
            description: richEntity.description.getValue(),
            engineeringId: richEntity.engineeringId,
            priority: richEntity.priority.getValue(),
            isActive: richEntity.status.isActive(),
            createdAt: richEntity.createdAt,
            updatedAt: richEntity.updatedAt
        };
    }
}

/**
 * 型別守衛 - 確保型別安全
 * @param template 需要驗證的對象
 */
export function isValidTaskTemplate(template: unknown): template is TaskTemplate {
    return (
        typeof template === 'object' &&
        template !== null &&
        'id' in template &&
        'name' in template &&
        'isActive' in template &&
        'createdAt' in template &&
        'updatedAt' in template
    );
}