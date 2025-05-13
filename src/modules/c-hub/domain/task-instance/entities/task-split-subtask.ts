/**
 * 子任務分割類型定義
 * 用於在任務分割子任務時傳遞數據
 */

/**
 * 子任務分割數據接口
 * 定義從任務分割子任務時需要的數據結構
 */
export interface TaskSplitSubtaskData {
    name?: string;
    description?: string | null;
    plannedStart?: Date | null;
    plannedEnd?: Date | null;
    equipmentCount?: number | null;
    actualEquipmentCount?: number | null;
}

/**
 * 檢驗子任務分割數據是否有效
 * @param data 子任務分割數據
 */
export function isValidSplitData(data: TaskSplitSubtaskData): boolean {
    // 基本驗證邏輯
    if (data.plannedStart && data.plannedEnd && data.plannedStart > data.plannedEnd) {
        return false;
    }

    if (data.actualEquipmentCount && data.equipmentCount && data.actualEquipmentCount > data.equipmentCount) {
        return false;
    }

    return true;
}
