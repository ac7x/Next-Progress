export interface SubTaskInstance {
    id: string;
    name: string;
    description: string | null;
    taskId: string; // 關聯的任務 ID
    status: string;
    priority: number;
    completionRate: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSubTaskInstanceProps {
    name: string;
    description?: string | null;
    taskId: string; // 必須指定任務 ID
    priority?: number;
    status?: string;
    completionRate?: number;
    isActive?: boolean;
}

export type UpdateSubTaskInstanceProps = Partial<CreateSubTaskInstanceProps>;

// 型別守衛函數
export function isValidSubTaskInstance(instance: unknown): instance is SubTaskInstance {
    return typeof instance === 'object' &&
        instance !== null &&
        'id' in instance &&
        'name' in instance &&
        'taskId' in instance &&
        'isActive' in instance &&
        'createdAt' in instance &&
        'updatedAt' in instance;
}
