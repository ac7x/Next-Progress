'use server';

/**
 * 工程實例命令服務 (Command Service)
 * 處理所有與修改工程實例相關的操作
 * 遵循 CQRS 原則，僅執行命令，不執行查詢
 */

import { CreateEngineeringInstanceProps, UpdateEngineeringInstanceProps } from '@/modules/c-hub/domain/engineering-instance/entities/engineering-instance-entity';
import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance/services/engineering-instance-service';
import { engineeringInstanceAdapter } from '@/modules/c-hub/infrastructure/engineering-instance/adapter/engineering-instance-adapter';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/repositories/engineering-instance-repository';
import { revalidatePath } from 'next/cache';

// 初始化領域服務
const engineeringInstanceService = new EngineeringInstanceDomainService(engineeringInstanceRepository);

/**
 * 創建新工程實例 - 命令處理函數
 * @param data 創建工程實例所需資料
 * @returns 創建的工程實例（可序列化格式）
 */
export async function createEngineeringCommand(data: CreateEngineeringInstanceProps): Promise<any> {
    try {
        if (!data.name?.trim()) {
            throw new Error('工程名稱不能為空');
        }

        if (!data.projectId?.trim()) {
            throw new Error('必須指定專案ID');
        }

        const engineering = await engineeringInstanceService.create(data);

        // 重新驗證相關頁面
        revalidatePath(`/client/project/${data.projectId}`);
        revalidatePath('/client/instance_management');

        // 返回可序列化的數據
        return engineeringInstanceAdapter.toSerializable(engineering);
    } catch (error) {
        console.error('創建工程實例失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('創建工程實例失敗: ' + String(error));
    }
}

/**
 * 更新工程實例
 * @param id 工程實例ID
 * @param data 更新資料
 * @param projectId 關聯的專案ID（用於頁面重新驗證）
 * @returns 更新後的工程實例（可序列化格式）
 */
export async function updateEngineeringInstance(
    id: string,
    data: UpdateEngineeringInstanceProps,
    projectId: string
): Promise<any> {
    try {
        if (!id?.trim()) {
            throw new Error('工程ID不能為空');
        }

        const engineering = await engineeringInstanceService.update(id, data);

        // 重新驗證相關頁面
        if (projectId) {
            revalidatePath(`/client/project/${projectId}`);
        }
        revalidatePath('/client/instance_management');

        // 返回可序列化的數據
        return engineeringInstanceAdapter.toSerializable(engineering);
    } catch (error) {
        console.error('更新工程實例失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('更新工程實例失敗: ' + String(error));
    }
}

/**
 * 刪除工程實例
 * @param id 工程實例ID
 * @param projectId 專案ID (用於頁面重新驗證)
 */
export async function deleteEngineeringInstance(id: string, projectId?: string): Promise<void> {
    try {
        if (!id?.trim()) {
            throw new Error('工程ID不能為空');
        }

        await engineeringInstanceService.delete(id);

        // 重新驗證相關頁面
        if (projectId) {
            revalidatePath(`/client/project/${projectId}`);
        }
        revalidatePath('/client/instance_management');
    } catch (error) {
        console.error('刪除工程實例失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('刪除工程實例失敗: ' + String(error));
    }
}