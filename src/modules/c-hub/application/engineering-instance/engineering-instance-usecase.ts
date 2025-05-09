'use server';

import { CreateEngineeringInstanceProps, EngineeringInstance } from '@/modules/c-hub/domain/engineering-instance';
import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance';
import { CreateEngineeringFromTemplateProps } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/engineering-instance-repository';
import { engineeringTemplateRepository } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-repository';
import { subTaskInstanceRepository } from '@/modules/c-hub/infrastructure/sub-task-instance/sub-task-instance-repository';
import { subTaskTemplateRepository } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template-repository';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/task-instance-repository';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/task-template-repository';
import { revalidatePath } from 'next/cache';

// 僅注入單一 repository，符合 DDD 原則
const engineeringService = new EngineeringInstanceDomainService(engineeringInstanceRepository);

// Query UseCases
export async function listEngineerings(): Promise<EngineeringInstance[]> {
    return engineeringService.list();
}

export async function getEngineeringById(id: string): Promise<EngineeringInstance | null> {
    if (!id?.trim()) throw new Error('工程ID不能為空');
    return engineeringService.getById(id);
}

export async function listEngineeringsByProject(projectId: string): Promise<EngineeringInstance[]> {
    if (!projectId?.trim()) throw new Error('專案ID不能為空');
    return engineeringInstanceRepository.listByProject(projectId);
}

// Command UseCases
export async function createEngineering(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance> {
    try {
        if (!data.name?.trim()) throw new Error('工程名稱不能為空');
        if (!data.projectId?.trim()) throw new Error('必須指定專案ID');
        const engineering = await engineeringService.create(data);

        revalidatePath(`/client/project/${data.projectId}`);
        revalidatePath('/client/manage');
        return engineering;
    } catch (error) {
        console.error('創建工程失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('創建工程失敗: ' + String(error));
    }
}

// 從模板創建工程（聚合協調應在 UseCase 層）
export async function createEngineeringFromTemplate(
    data: CreateEngineeringFromTemplateProps
): Promise<EngineeringInstance> {
    try {
        if (!data.engineeringTemplateId?.trim()) throw new Error('工程模板ID不能為空');
        if (!data.projectId?.trim()) throw new Error('專案ID不能為空');

        // 1. 取得模板
        const template = await engineeringTemplateRepository.getById(data.engineeringTemplateId);
        if (!template) throw new Error('找不到指定的工程模板');

        // 2. 建立工程
        const engineering = await engineeringService.create({
            name: data.name || template.name,
            description: data.description || template.description,
            projectId: data.projectId,
            userId: data.userId || 'system'
        });

        // 3. 取得任務模板
        const taskTemplates = await taskTemplateRepository.findByEngineeringTemplateId(data.engineeringTemplateId);

        // 4. 預查所有子任務模板
        const allSubTaskTemplatesMap: Record<string, any[]> = {};
        await Promise.all(
            taskTemplates.map(async (taskTemplate) => {
                allSubTaskTemplatesMap[taskTemplate.id] = await subTaskTemplateRepository.findByTaskTemplateId(taskTemplate.id);
            })
        );

        // 5. 根據前端傳來的數量資訊建立任務
        const taskCountMap: Record<string, number> = {};
        if (Array.isArray(data.tasks)) {
            data.tasks.forEach(t => {
                if (t.taskTemplateId && t.count > 0) {
                    taskCountMap[t.taskTemplateId] = t.count;
                }
            });
        }

        await Promise.all(
            taskTemplates.map(async (taskTemplate) => {
                const count = taskCountMap[taskTemplate.id] ?? 1;
                const task = await taskInstanceRepository.create({
                    name: taskTemplate.name,
                    description: taskTemplate.description,
                    engineeringId: engineering.id,
                    projectId: data.projectId,
                    status: 'TODO',
                    priority: taskTemplate.priority ?? 0,
                    equipmentCount: count
                });

                // 建立子任務
                const subTaskTemplates = allSubTaskTemplatesMap[taskTemplate.id] || [];
                if (subTaskTemplates.length > 0) {
                    await Promise.all(
                        subTaskTemplates.map(subTemplate =>
                            subTaskInstanceRepository.create({
                                name: subTemplate.name,
                                description: subTemplate.description,
                                priority: subTemplate.priority ?? 0,
                                taskId: task.id,
                                status: 'TODO',
                            })
                        )
                    );
                }
            })
        );

        revalidatePath(`/client/project/${data.projectId}`);
        revalidatePath('/client/manage');
        return engineering;
    } catch (error) {
        console.error('從模板創建工程失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('從模板創建工程失敗: ' + String(error));
    }
}
