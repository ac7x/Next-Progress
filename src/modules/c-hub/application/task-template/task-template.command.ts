'use server';

import { CreateTaskTemplateProps, TaskTemplate, UpdateTaskTemplateProps, isValidTaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { TaskTemplateDomainService } from '@/modules/c-hub/domain/task-template/task-template-service';
import { TemplateTypes } from '@/modules/c-hub/domain/template-relation/template-relation-entity';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/task-template-repository';
import { revalidatePath } from 'next/cache';
import { templateRelationService } from '../template-relation/template-relation-service';

const templateService = new TaskTemplateDomainService(taskTemplateRepository);

// Command: 建立任務模板
export async function createTaskTemplateCommand(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
    if (!data.name?.trim()) throw new Error('任務模板名稱為必填項');
    const template = await templateService.createTemplate(data);
    if (!isValidTaskTemplate(template)) throw new Error('無效的任務模板數據');
    revalidatePath('/client/template');
    return template;
}

// Command: 更新任務模板
export async function updateTaskTemplateCommand(id: string, data: UpdateTaskTemplateProps): Promise<TaskTemplate> {
    if (!id?.trim()) throw new Error('模板 ID 為必填項');
    const template = await templateService.updateTemplate(id, data);
    revalidatePath('/client/template');
    return template;
}

// Command: 刪除任務模板
export async function deleteTaskTemplateCommand(id: string): Promise<void> {
    if (!id?.trim()) throw new Error('模板 ID 為必填項');
    await templateService.deleteTemplate(id);
    revalidatePath('/client/template');
}

// 新增命令: 建立任務模板並關聯到工程模板
export async function createTaskTemplateWithEngineeringCommand(
    data: CreateTaskTemplateProps,
    engineeringTemplateId: string
): Promise<TaskTemplate> {
    if (!data.name?.trim()) throw new Error('任務模板名稱為必填項');
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');

    // 建立任務模板
    const template = await templateService.createTemplate(data);

    // 建立與工程模板的關聯
    await templateRelationService.addTaskTemplateToEngineeringTemplate(
        engineeringTemplateId,
        template.id
    );

    revalidatePath('/client/template');
    return template;
}

// 新增命令: 將任務模板關聯到工程模板
export async function linkTaskTemplateToEngineeringCommand(
    taskTemplateId: string,
    engineeringTemplateId: string,
    orderIndex?: number
): Promise<void> {
    if (!taskTemplateId?.trim()) throw new Error('任務模板 ID 為必填項');
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');

    await templateRelationService.addTaskTemplateToEngineeringTemplate(
        engineeringTemplateId,
        taskTemplateId,
        orderIndex
    );

    revalidatePath('/client/template');
}

// 新增命令: 移除任務模板與工程模板的關聯
export async function unlinkTaskTemplateFromEngineeringCommand(
    taskTemplateId: string,
    engineeringTemplateId: string
): Promise<void> {
    if (!taskTemplateId?.trim()) throw new Error('任務模板 ID 為必填項');
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');

    // 查詢此關聯
    const relations = await templateRelationService.getChildRelationsByType(
        TemplateTypes.ENGINEERING_TEMPLATE,
        engineeringTemplateId,
        TemplateTypes.TASK_TEMPLATE
    );

    // 找出符合的關聯 ID
    const relation = relations.find(r => r.childId === taskTemplateId);
    if (relation) {
        await templateRelationService.removeRelation(relation.id);
    }

    revalidatePath('/client/template');
}

// 新增命令: 更新任務模板在工程模板中的排序
export async function updateTaskTemplateOrderInEngineeringCommand(
    engineeringTemplateId: string,
    orderedTaskIds: string[]
): Promise<void> {
    if (!engineeringTemplateId?.trim()) throw new Error('工程模板 ID 為必填項');
    if (!orderedTaskIds.length) throw new Error('任務模板順序為必填項');

    // 獲取現有關聯
    const relations = await templateRelationService.getChildRelationsByType(
        TemplateTypes.ENGINEERING_TEMPLATE,
        engineeringTemplateId,
        TemplateTypes.TASK_TEMPLATE
    );

    // 建立 ID 到關聯的映射
    const idToRelation = new Map(relations.map(r => [r.childId, r]));

    // 準備排序更新
    const updates = orderedTaskIds
        .map((taskId, index) => {
            const relation = idToRelation.get(taskId);
            if (relation) {
                return { id: relation.id, orderIndex: index };
            }
            return null;
        })
        .filter((update): update is { id: string, orderIndex: number } => update !== null);

    // 更新順序
    if (updates.length > 0) {
        await templateRelationService.updateRelationsOrder(updates);
        revalidatePath('/client/template');
    }
}
