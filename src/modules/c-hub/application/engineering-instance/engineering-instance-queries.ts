'use server';

/**
 * 工程實例查詢服務 (Query Service)
 * 處理所有與讀取工程實例相關的操作
 * 遵循 CQRS 原則，僅執行查詢，不執行命令
 */

import { EngineeringInstance } from '@/modules/c-hub/domain/engineering-instance/entities/engineering-instance-entity';
import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance/services/engineering-instance-service';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/engineering-instance-repository';

// 初始化領域服務
const engineeringInstanceService = new EngineeringInstanceDomainService(engineeringInstanceRepository);

/**
 * 查詢所有工程實例
 * @returns 工程實例列表
 */
export async function listEngineeringInstances(): Promise<EngineeringInstance[]> {
    try {
        return await engineeringInstanceService.list();
    } catch (error) {
        console.error('獲取工程實例列表失敗:', error);
        return [];
    }
}

/**
 * 根據ID查詢工程實例
 * @param id 工程實例ID
 * @returns 工程實例或null
 */
export async function getEngineeringInstanceById(id: string): Promise<EngineeringInstance | null> {
    if (!id?.trim()) {
        throw new Error('工程ID不能為空');
    }

    try {
        return await engineeringInstanceService.getById(id);
    } catch (error) {
        console.error(`獲取工程實例(ID: ${id})失敗:`, error);
        return null;
    }
}

/**
 * 查詢特定專案的工程實例列表
 * @param projectId 專案ID
 * @returns 該專案下的工程實例列表
 */
export async function listEngineeringInstancesByProject(projectId: string): Promise<EngineeringInstance[]> {
    if (!projectId?.trim()) {
        throw new Error('專案ID不能為空');
    }

    try {
        return await engineeringInstanceService.listByProject(projectId);
    } catch (error) {
        console.error(`獲取專案(ID: ${projectId})工程實例列表失敗:`, error);
        return [];
    }
}