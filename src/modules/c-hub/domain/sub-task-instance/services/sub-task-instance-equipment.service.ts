/**
 * 子任務設備數量管理服務
 * 處理子任務與父任務之間的設備數量關係
 */
import { TaskInstance } from '../../task-instance/entities/task-instance-entity';
import { SubTaskInstance } from '../entities/sub-task-instance-entity';

/**
 * 子任務設備數量計算結果
 */
export interface SubTaskEquipmentCalculation {
    /**
     * 父任務總預計設備數量
     */
    parentTotal: number;

    /**
     * 子任務已分配的設備數量總和
     */
    subtasksAllocated: number;

    /**
     * 子任務實際使用的設備數量總和
     */
    subtasksActual: number;

    /**
     * 父任務未分配的設備數量
     */
    parentRemaining: number;

    /**
     * 父任務的實際完成數量（等於子任務實際完成總和）
     */
    parentActualEquipment: number;

    /**
     * 父任務的完成百分比
     */
    parentCompletionRate: number;
}

/**
 * 根據子任務計算父任務的設備數量相關信息
 * @param parentTask 父任務
 * @param subTasks 子任務清單
 * @returns 設備數量計算結果
 */
export function calculateEquipmentRelationship(
    parentTask: TaskInstance,
    subTasks: SubTaskInstance[]
): SubTaskEquipmentCalculation {
    // 父任務總設備數量
    const parentTotal = parentTask.equipmentCount || 0;

    // 子任務已分配的設備數量總和
    const subtasksAllocated = subTasks.reduce(
        (total, subTask) => total + (subTask.equipmentCount || 0),
        0
    );

    // 子任務實際使用的設備數量總和
    const subtasksActual = subTasks.reduce(
        (total, subTask) => total + (subTask.actualEquipmentCount || 0),
        0
    );

    // 父任務未分配的設備數量
    const parentRemaining = Math.max(0, parentTotal - subtasksAllocated);

    // 計算父任務完成百分比
    const parentCompletionRate = parentTotal > 0
        ? Math.min(100, Math.round((subtasksActual / parentTotal) * 100))
        : 0;

    return {
        parentTotal,
        subtasksAllocated,
        subtasksActual,
        parentRemaining,
        parentActualEquipment: subtasksActual,
        parentCompletionRate
    };
}

/**
 * 檢查新子任務的設備數量是否合理
 * @param parentTask 父任務
 * @param existingSubTasks 現有子任務
 * @param newSubTaskEquipment 新子任務的設備數量
 * @returns 檢查結果，如果通過則為 true
 */
export function validateNewSubTaskEquipment(
    parentTask: TaskInstance,
    existingSubTasks: SubTaskInstance[],
    newSubTaskEquipment: number
): { valid: boolean; message?: string } {
    const calculation = calculateEquipmentRelationship(parentTask, existingSubTasks);

    if (newSubTaskEquipment > calculation.parentRemaining) {
        return {
            valid: false,
            message: `子任務設備數量 ${newSubTaskEquipment} 超過了父任務剩餘可分配數量 ${calculation.parentRemaining}`
        };
    }

    return { valid: true };
}
