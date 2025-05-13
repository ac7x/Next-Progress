/**
 * 子任務分割功能相關領域服務擴展
 * 處理父子任務之間的關係和數值計算
 */

import { SubTaskInstance } from "../../sub-task-instance/entities/sub-task-instance-entity";
import { TaskInstance } from "../entities/task-instance-entity";

/**
 * 計算父任務和子任務之間的設備數量關係
 * @param parentTask 父任務
 * @param subTasks 子任務列表
 */
export function calculateEquipmentDistribution(
    parentTask: TaskInstance,
    subTasks: SubTaskInstance[]
) {
    // 父任務總設備數量保持不變
    const parentEquipmentCount = parentTask.equipmentCount || 0;

    // 計算子任務已分配的設備數量總和
    const allocatedEquipment = subTasks.reduce(
        (total, subTask) => total + (subTask.equipmentCount || 0),
        0
    );

    // 計算子任務實際使用的設備數量總和
    const actualUsedEquipment = subTasks.reduce(
        (total, subTask) => total + (subTask.actualEquipmentCount || 0),
        0
    );

    // 返回計算結果
    return {
        parentEquipmentCount,    // 父任務總設備數量
        allocatedEquipment,      // 子任務已分配設備數量總和
        actualUsedEquipment,     // 子任務實際使用設備數量總和
        remainingEquipment: parentEquipmentCount - allocatedEquipment // 父任務剩餘可分配設備數量
    };
}

/**
 * 從子任務列表計算父任務進度和時間範圍
 * @param subTasks 子任務列表
 */
export function calculateParentTaskProgress(subTasks: SubTaskInstance[]) {
    if (!subTasks.length) {
        return {
            earliestPlannedStart: null,
            latestPlannedEnd: null,
            completionRate: 0
        };
    }

    // 初始化為第一個子任務的值
    let earliestPlannedStart = subTasks[0].plannedStart;
    let latestPlannedEnd = subTasks[0].plannedEnd;
    let totalCompletionWeight = 0;
    let weightedCompletionSum = 0;

    // 遍歷所有子任務，找出最早開始時間和最晚結束時間
    subTasks.forEach(subTask => {
        // 計算最早計劃開始時間
        if (subTask.plannedStart && (!earliestPlannedStart || subTask.plannedStart < earliestPlannedStart)) {
            earliestPlannedStart = subTask.plannedStart;
        }

        // 計算最晚計劃結束時間
        if (subTask.plannedEnd && (!latestPlannedEnd || subTask.plannedEnd > latestPlannedEnd)) {
            latestPlannedEnd = subTask.plannedEnd;
        }

        // 使用設備數量作為子任務權重
        const weight = subTask.equipmentCount || 1;
        totalCompletionWeight += weight;
        weightedCompletionSum += (subTask.completionRate || 0) * weight;
    });

    // 計算加權平均完成率，如果沒有權重則為0
    const completionRate = totalCompletionWeight > 0
        ? Math.round(weightedCompletionSum / totalCompletionWeight)
        : 0;

    return {
        earliestPlannedStart,
        latestPlannedEnd,
        completionRate
    };
}
