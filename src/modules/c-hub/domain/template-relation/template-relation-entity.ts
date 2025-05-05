export interface TemplateRelation {
    id: string;
    parentType: string; // 如 'ProjectTemplate'、'EngineeringTemplate' 等
    parentId: string;
    childType: string; // 如 'EngineeringTemplate'、'TaskTemplate' 等
    childId: string;
    orderIndex: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTemplateRelationProps {
    parentType: string;
    parentId: string;
    childType: string;
    childId: string;
    orderIndex?: number | null;
}

export type UpdateTemplateRelationProps = Partial<CreateTemplateRelationProps>;

// 模板類型常量，確保類型名稱統一
export const TemplateTypes = {
    PROJECT_TEMPLATE: 'ProjectTemplate',
    ENGINEERING_TEMPLATE: 'EngineeringTemplate',
    TASK_TEMPLATE: 'TaskTemplate',
    SUB_TASK_TEMPLATE: 'SubTaskTemplate'
} as const;

export type TemplateType = typeof TemplateTypes[keyof typeof TemplateTypes];

// 檢查是否為有效的 TemplateRelation
export function isValidTemplateRelation(relation: unknown): relation is TemplateRelation {
    return typeof relation === 'object' &&
        relation !== null &&
        'id' in relation &&
        'parentId' in relation &&
        'childId' in relation &&
        'parentType' in relation &&
        'childType' in relation;
}