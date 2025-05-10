/**
 * 任務實例相關常數
 * 集中管理任務實例領域中使用的常數，增強代碼可讀性與可維護性
 */

/**
 * 任務優先級常量
 * 數值越小優先級越高
 */
export const TASK_PRIORITY = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2
} as const;

/**
 * 任務狀態常量
 */
export const TASK_STATUS = {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE'
} as const;

/**
 * 任務完成率常量
 */
export const COMPLETION_RATE = {
    MIN: 0,
    MAX: 100
} as const;