'use server';

/**
 * 工程實例工廠服務 (Factory Service)
 * 特殊用例：從模板創建工程實例的工廠邏輯
 * 跨越多個聚合根邊界，協調工程模板、工程實例、任務模板和任務實例
 */

import { CreateEngineeringInstanceProps } from '@/modules/c-hub/domain/engineering-instance/entities/engineering-instance-entity';
import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance/services/engineering-instance-service';
import { engineeringInstanceAdapter } from '@/modules/c-hub/infrastructure/engineering-instance/adapter/engineering-instance-adapter';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/repositories/engineering-instance-repository';
import { engineeringTemplateRepository } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-repository';
import { taskInstanceRepository } from '@/modules/c-hub/infrastructure/task-instance/repositories/task-instance-repository';
import { taskTemplateRepository } from '@/modules/c-hub/infrastructure/task-template/repositories/task-template-repository';
import { revalidatePath } from 'next/cache';

/**
 * 從工程模板創建工程實例的輸入資料
 */
export interface CreateEngineeringFromTemplateProps {
    engineeringTemplateId: string;
    projectId: string;
    name?: string;
    description?: string | null;
    userId?: string;
    tasks?: { taskTemplateId: string; count: number }[];
}

// 初始化領域服務
const engineeringService = new EngineeringInstanceDomainService(engineeringInstanceRepository);

/**
 * 從工程模板創建工程實例 - 融合模板數據和用戶輸入
 * 協調多個聚合根的特殊工廠方法
 * 
 * @param data 創建所需資料
 * @returns 創建的工程實例（可序列化格式）
 */
export async function createEngineeringFromTemplate(
    data: CreateEngineeringFromTemplateProps
): Promise<any> {
    try {
        if (!data.engineeringTemplateId?.trim()) {
            throw new Error('工程模板ID不能為空');
        }

        if (!data.projectId?.trim()) {
            throw new Error('專案ID不能為空');
        }

        // 1. 獲取工程模板
        const template = await engineeringTemplateRepository.getById(data.engineeringTemplateId);
        if (!template) {
            throw new Error(`找不到ID為 ${data.engineeringTemplateId} 的工程模板`);
        }

        // 2. 準備創建工程實例的數據
        const createData: CreateEngineeringInstanceProps = {
            name: data.name || template.name, // 使用字串值
            description: data.description !== undefined ? data.description : template.description, // 使用字串或 null 值
            projectId: data.projectId,
            userId: data.userId
        };

        // 3. 創建工程實例
        const engineering = await engineeringService.create(createData);

        // 4. 如果需要創建任務，則處理任務的創建（可選）
        if (data.tasks && data.tasks.length > 0) {
            for (const taskInfo of data.tasks) {
                const taskTemplate = await taskTemplateRepository.getById(taskInfo.taskTemplateId);
                if (!taskTemplate) {
                    console.warn(`找不到ID為 ${taskInfo.taskTemplateId} 的任務模板，已跳過`);
                    continue;
                }

                // 考慮批量創建多個相同任務的場景
                const count = taskInfo.count || 1;
                for (let i = 0; i < count; i++) {
                    // 從任務模板創建任務實例
                    await taskInstanceRepository.create({
                        name: taskTemplate.name,
                        description: taskTemplate.description,
                        engineeringId: engineering.id,
                        projectId: data.projectId
                    });
                }
            }
        }

        // 重新驗證相關頁面
        revalidatePath(`/client/project/${data.projectId}`);
        revalidatePath('/client/instance_management');

        // 將領域實體轉換為可序列化格式後返回
        return engineeringInstanceAdapter.toSerializable(engineering);
    } catch (error) {
        console.error('從模板創建工程實例失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('從模板創建工程實例失敗: ' + String(error));
    }
}