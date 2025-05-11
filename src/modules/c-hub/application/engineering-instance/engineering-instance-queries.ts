'use server';

/**
 * 工程實例查詢服務 (Query Service)
 * 處理所有與讀取工程實例相關的操作
 * 遵循 CQRS 原則，僅執行查詢，不執行命令
 */

import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance/services/engineering-instance-service';
import { engineeringInstanceAdapter } from '@/modules/c-hub/infrastructure/engineering-instance/adapter/engineering-instance-adapter';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/repositories/engineering-instance-repository';

// 初始化領域服務
const engineeringInstanceService = new EngineeringInstanceDomainService(engineeringInstanceRepository);

/**
 * 查詢所有工程實例
 * @returns 工程實例列表
 */
export async function listEngineeringInstances(): Promise<any[]> {
    try {
        const instances = await engineeringInstanceService.list();
        // 將領域實體轉換為可序列化格式
        return engineeringInstanceAdapter.toSerializableList(instances);
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
export async function getEngineeringInstanceById(id: string): Promise<any | null> {
    if (!id?.trim()) {
        throw new Error('工程ID不能為空');
    }

    try {
        const instance = await engineeringInstanceService.getById(id);
        // 將領域實體轉換為可序列化格式
        return instance ? engineeringInstanceAdapter.toSerializable(instance) : null;
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
export async function listEngineeringInstancesByProject(projectId: string): Promise<any[]> {
    if (!projectId?.trim()) {
        throw new Error('專案ID不能為空');
    }

    try {
        const instances = await engineeringInstanceService.listByProject(projectId);
        // 將領域實體轉換為可序列化格式
        return engineeringInstanceAdapter.toSerializableList(instances);
    } catch (error) {
        console.error(`獲取專案(ID: ${projectId})工程實例列表失敗:`, error);
        return [];
    }
}