// ProjectInstance Priority Value Object
import { Priority } from './priority.vo';

export type ProjectInstancePriority = number;

export function isValidProjectInstancePriority(priority: unknown): priority is ProjectInstancePriority {
    if (typeof priority === 'number') {
        return priority >= Priority.MIN && priority <= Priority.MAX;
    }
    return false;
}

/**
 * 創建專案優先級值物件
 * @param priority 優先級數值或優先級值物件
 * @returns 優先級數值
 */
export function createProjectInstancePriority(priority: number | Priority | null | undefined): ProjectInstancePriority {
    // 處理未定義的情況
    if (priority === null || priority === undefined) {
        return Priority.MAX; // 默認為最低優先級
    }

    // 若是 Priority 實例，獲取其數值
    if (typeof priority === 'object' && 'getValue' in priority) {
        return priority.getValue();
    }

    // 若是數字，確保在有效範圍內
    if (typeof priority === 'number') {
        return Math.max(Priority.MIN, Math.min(Priority.MAX, priority));
    }

    return Priority.MAX; // 默認為最低優先級
}