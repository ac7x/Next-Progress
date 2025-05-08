export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface ProjectInstance {
  id: string;
  name: string;
  description: string | null;
  priority?: number | null; // 添加 priority 欄位
  status?: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInstanceProps {
  name: string;
  description?: string | null;
  priority?: number | null; // 添加 priority 欄位
  status?: ProjectStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  createdBy: string;
  templateId?: string | null;
}

// 添加型別守衛函數
export function isValidProjectInstance(project: unknown): project is ProjectInstance {
  return typeof project === 'object' &&
    project !== null &&
    'id' in project &&
    'name' in project &&
    'createdBy' in project &&
    'createdAt' in project &&
    'updatedAt' in project;
}
