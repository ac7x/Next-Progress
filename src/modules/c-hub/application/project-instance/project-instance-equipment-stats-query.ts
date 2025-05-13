'use server';

import { listTaskInstancesByProject } from '@/modules/c-hub/application/task-instance/task-instance-actions';

/**
 * 專案設備統計結果介面
 */
export interface ProjectEquipmentStats {
    equipmentCount: number;
    actualEquipmentCount: number;
    completionRate: number;
}

/**
 * 獲取專案實例的設備統計信息（設備總數、已完成設備數、完成率）
 * 
 * @param projectInstanceId 專案實例ID
 * @returns 專案設備統計結果
 */
export async function getProjectEquipmentStats(projectInstanceId: string): Promise<ProjectEquipmentStats> {
    const tasks = await listTaskInstancesByProject(projectInstanceId);

    // 計算設備總數和已完成設備數
    let equipmentCount = 0;
    let actualEquipmentCount = 0;

    for (const task of tasks) {
        equipmentCount += task.equipmentCount ?? 0;
        actualEquipmentCount += task.actualEquipmentCount ?? 0;
    }

    // 計算完成率
    const completionRate = equipmentCount > 0
        ? Math.min(100, Math.round((actualEquipmentCount / equipmentCount) * 100))
        : 0;

    return {
        equipmentCount,
        actualEquipmentCount,
        completionRate
    };
}

/**
 * 批量獲取多個專案的設備統計信息
 * 
 * @param projectInstanceIds 專案實例ID數組
 * @returns 以專案ID為鍵的統計結果映射
 */
export async function getBatchProjectEquipmentStats(
    projectInstanceIds: string[]
): Promise<Record<string, ProjectEquipmentStats>> {
    if (!projectInstanceIds || projectInstanceIds.length === 0) return {};

    const result: Record<string, ProjectEquipmentStats> = {};

    // 使用 Promise.all 批量併行查詢，提高性能
    await Promise.all(
        projectInstanceIds.map(async (id) => {
            const stats = await getProjectEquipmentStats(id);
            result[id] = stats;
        })
    );

    return result;
}
