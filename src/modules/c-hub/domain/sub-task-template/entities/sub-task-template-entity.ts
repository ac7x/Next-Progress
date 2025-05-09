import { SubTaskTemplateCompletionRate } from '../value-objects/sub-task-template-completion-rate.vo';
import { SubTaskTemplateDescription } from '../value-objects/sub-task-template-description.vo';
import { SubTaskTemplateEquipmentCount } from '../value-objects/sub-task-template-equipment-count.vo';
import { SubTaskTemplateName } from '../value-objects/sub-task-template-name.vo';
import { SubTaskTemplateOrderIndex } from '../value-objects/sub-task-template-order-index.vo';
import { SubTaskTemplatePriority } from '../value-objects/sub-task-template-priority.vo';
import { SubTaskTemplateStatus, SubTaskTemplateStatusType } from '../value-objects/sub-task-template-status.vo';

/**
 * 子任務模板實體定義 - 使用值物件增強業務約束與語義
 */
export interface SubTaskTemplate {
    id: string;
    name: string;
    description: string | null;
    plannedStart: Date | null;
    plannedEnd: Date | null;
    equipmentCount: number | null;
    priority: number;
    status: string;
    completionRate: number;
    isMandatory: boolean;
    orderIndex: number;
    parentTemplateId: string | null;
    taskTemplateId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 建立子任務模板的輸入資料
 */
export interface CreateSubTaskTemplateProps {
    name: string;
    description?: string | null;
    plannedStart?: Date | null;
    plannedEnd?: Date | null;
    equipmentCount?: number | null;
    taskTemplateId: string;
    priority?: number;
    status?: SubTaskTemplateStatusType;
    completionRate?: number;
    isMandatory?: boolean;
    orderIndex?: number;
    parentTemplateId?: string | null;
    isActive?: boolean;
}

/**
 * 更新子任務模板的輸入資料
 */
export type UpdateSubTaskTemplateProps = Partial<CreateSubTaskTemplateProps>;

/**
 * 豐富的領域模型 - 使用值物件
 */
export interface RichSubTaskTemplate {
    id: string;
    name: SubTaskTemplateName;
    description: SubTaskTemplateDescription;
    plannedStart: Date | null;
    plannedEnd: Date | null;
    equipmentCount: SubTaskTemplateEquipmentCount;
    priority: SubTaskTemplatePriority;
    status: SubTaskTemplateStatus;
    completionRate: SubTaskTemplateCompletionRate;
    isMandatory: boolean;
    orderIndex: SubTaskTemplateOrderIndex;
    parentTemplateId: string | null;
    taskTemplateId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 子任務模板工廠 - 負責建立與驗證子任務模板實體
 */
export class SubTaskTemplateFactory {
    /**
     * 從基本資料創建子任務模板
     * @param props 子任務模板屬性
     */
    static create(props: CreateSubTaskTemplateProps): Partial<RichSubTaskTemplate> {
        return {
            name: new SubTaskTemplateName(props.name),
            description: new SubTaskTemplateDescription(props.description ?? null),
            plannedStart: props.plannedStart || null,
            plannedEnd: props.plannedEnd || null,
            equipmentCount: new SubTaskTemplateEquipmentCount(props.equipmentCount ?? null),
            priority: new SubTaskTemplatePriority(props.priority ?? 0),
            status: new SubTaskTemplateStatus(props.status || 'pending'),
            completionRate: new SubTaskTemplateCompletionRate(props.completionRate ?? 0),
            isMandatory: props.isMandatory ?? true,
            orderIndex: new SubTaskTemplateOrderIndex(props.orderIndex ?? 0),
            parentTemplateId: props.parentTemplateId || null,
            taskTemplateId: props.taskTemplateId,
            isActive: props.isActive ?? true
        };
    }

    /**
     * 將資料庫實體轉換為豐富領域實體
     * @param entity 基本實體
     */
    static toRichModel(entity: SubTaskTemplate): RichSubTaskTemplate {
        return {
            id: entity.id,
            name: new SubTaskTemplateName(entity.name),
            description: new SubTaskTemplateDescription(entity.description),
            plannedStart: entity.plannedStart,
            plannedEnd: entity.plannedEnd,
            equipmentCount: new SubTaskTemplateEquipmentCount(entity.equipmentCount),
            priority: new SubTaskTemplatePriority(entity.priority),
            status: new SubTaskTemplateStatus(entity.status),
            completionRate: new SubTaskTemplateCompletionRate(entity.completionRate),
            isMandatory: entity.isMandatory,
            orderIndex: new SubTaskTemplateOrderIndex(entity.orderIndex),
            parentTemplateId: entity.parentTemplateId,
            taskTemplateId: entity.taskTemplateId,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    /**
     * 將豐富領域實體轉換為基本實體
     * @param richEntity 豐富領域實體
     */
    static toBasicModel(richEntity: RichSubTaskTemplate): SubTaskTemplate {
        return {
            id: richEntity.id,
            name: richEntity.name.getValue(),
            description: richEntity.description.getValue(),
            plannedStart: richEntity.plannedStart,
            plannedEnd: richEntity.plannedEnd,
            equipmentCount: richEntity.equipmentCount.getValue(),
            priority: richEntity.priority.getValue(),
            status: richEntity.status.getValue(),
            completionRate: richEntity.completionRate.getValue(),
            isMandatory: richEntity.isMandatory,
            orderIndex: richEntity.orderIndex.getValue(),
            parentTemplateId: richEntity.parentTemplateId,
            taskTemplateId: richEntity.taskTemplateId,
            isActive: richEntity.isActive,
            createdAt: richEntity.createdAt,
            updatedAt: richEntity.updatedAt
        };
    }
}

/**
 * 型別守衛 - 確保型別安全
 * @param template 需要驗證的對象
 */
export function isValidSubTaskTemplate(template: unknown): template is SubTaskTemplate {
    return (
        typeof template === 'object' &&
        template !== null &&
        'id' in template &&
        'name' in template &&
        'taskTemplateId' in template &&
        'isActive' in template &&
        'isMandatory' in template &&
        'orderIndex' in template &&
        'createdAt' in template &&
        'updatedAt' in template
    );
}