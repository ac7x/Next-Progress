export type SubTaskInstanceStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface SubTaskInstance {
  id: string;
  name: string;
  description: string | null;
  plannedStart: Date | null;
  plannedEnd: Date | null;
  equipmentCount: number | null;
  actualEquipmentCount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  priority: number;
  status: SubTaskInstanceStatus;
  completionRate: number;
  taskId: string;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubTaskInstanceProps {
  name: string;
  description?: string | null;
  plannedStart?: Date | null;
  plannedEnd?: Date | null;
  equipmentCount?: number | null;
  actualEquipmentCount?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  priority?: number;
  status?: SubTaskInstanceStatus;
  completionRate?: number;
  taskId: string;
  parentTaskId?: string | null;
}

export type UpdateSubTaskInstanceProps = Partial<CreateSubTaskInstanceProps>;

export function isValidSubTaskInstance(subTaskInstance: unknown): subTaskInstance is SubTaskInstance {
  return typeof subTaskInstance === 'object' &&
    subTaskInstance !== null &&
    'id' in subTaskInstance &&
    'name' in subTaskInstance &&
    'taskId' in subTaskInstance &&
    'status' in subTaskInstance &&
    'createdAt' in subTaskInstance &&
    'updatedAt' in subTaskInstance;
}
