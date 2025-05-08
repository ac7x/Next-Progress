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
 * 根據優先級名稱獲取數值
 */
export function getPriorityValue(priorityName?: 'HIGH' | 'MEDIUM' | 'LOW'): number {
  if (!priorityName) return TASK_PRIORITY.MEDIUM;
  return TASK_PRIORITY[priorityName];
}

/**
 * 根據優先級數值獲取名稱
 */
export function getPriorityName(priorityValue?: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (priorityValue === 0) return 'HIGH';
  if (priorityValue === 2) return 'LOW';
  return 'MEDIUM';
}
