export type TaskInstanceStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskInstance {
  id: string;
  name: string;
  description: string | null;
  plannedStart: Date | null;
  plannedEnd: Date | null;
  equipmentCount: number | null;
  actualEquipmentCount: number | null;
  status: TaskInstanceStatus;
  priority: number;
  completionRate: number;
  engineeringId: string | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInstanceProps {
  name: string;
  description?: string | null;
  plannedStart?: Date | null;
  plannedEnd?: Date | null;
  equipmentCount?: number | null;
  actualEquipmentCount?: number | null;
  status?: TaskInstanceStatus;
  priority?: number;
  completionRate?: number;
  engineeringId?: string | null;
  projectId?: string;
}

// 定義任務實例更新操作的參數型別
export type UpdateTaskInstanceProps = Partial<Omit<TaskInstance, 'id' | 'createdAt' | 'updatedAt'>>;

export function isValidTaskInstance(task: unknown): task is TaskInstance {
  return typeof task === 'object' &&
    task !== null &&
    'id' in task &&
    'name' in task &&
    'status' in task &&
    'createdAt' in task &&
    'updatedAt' in task;
}
