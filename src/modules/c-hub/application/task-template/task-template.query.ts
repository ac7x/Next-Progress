'use server';

import { TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { TaskTemplateDomainService } from '@/modules/c-hub/domain/task-template/task-template-service';
import { TemplateTypes } from '@/modules/c-hub/domain/template-relation/template-relation-entity';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/task-template-repository';
import { templateRelationService } from '../template-relation/template-relation-service';

const templateService = new TaskTemplateDomainService(taskTemplateRepository);

// Query: 取得所有任務模板
export async function listTaskTemplatesQuery(): Promise<TaskTemplate[]> {
    return templateService.listTemplates();
}

// Query: 依ID取得任務模板
export async function getTaskTemplateQuery(id: string): Promise<TaskTemplate | null> {
    if (!id?.trim()) throw new Error('模板 ID 為必填項');
    return templateService.getTemplateById(id);
}

// Query: 依工程模板ID取得任務模板
export async function listTaskTemplatesByEngineeringIdQuery(engineeringTemplateId: string): Promise<TaskTemplate[]> {
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');
    return templateService.findTaskTemplatesByEngineeringTemplateId(engineeringTemplateId);
}

// 新增 Query: 檢查任務模板是否已關聯到工程模板
export async function isTaskTemplateLinkedToEngineeringQuery(
    taskTemplateId: string,
    engineeringTemplateId: string
): Promise<boolean> {
    if (!taskTemplateId?.trim()) throw new Error('任務模板 ID 為必填項');
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');

    const relations = await templateRelationService.getChildRelationsByType(
        TemplateTypes.ENGINEERING_TEMPLATE,
        engineeringTemplateId,
        TemplateTypes.TASK_TEMPLATE
    );

    return relations.some(relation => relation.childId === taskTemplateId);
}

// 新增 Query: 取得任務模板在工程模板中的排序索引
export async function getTaskTemplateOrderIndexQuery(
    taskTemplateId: string,
    engineeringTemplateId: string
): Promise<number | null> {
    if (!taskTemplateId?.trim()) throw new Error('任務模板 ID 為必填項');
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');

    const relations = await templateRelationService.getChildRelationsByType(
        TemplateTypes.ENGINEERING_TEMPLATE,
        engineeringTemplateId,
        TemplateTypes.TASK_TEMPLATE
    );

    const relation = relations.find(r => r.childId === taskTemplateId);
    return relation ? relation.orderIndex : null;
}

// 新增 Query: 取得工程模板下所有任務模板 ID，按順序
export async function listTaskTemplateIdsByEngineeringIdQuery(
    engineeringTemplateId: string
): Promise<string[]> {
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');

    return templateRelationService.getTaskTemplateIdsByEngineeringTemplate(engineeringTemplateId);
}
