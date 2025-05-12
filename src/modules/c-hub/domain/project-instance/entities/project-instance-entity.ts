import { ProjectInstanceCreatedBy } from '../value-objects/project-instance-created-by.vo';
import { ProjectInstanceDescription } from '../value-objects/project-instance-description.vo';
import { ProjectInstanceName } from '../value-objects/project-instance-name.vo';
import { ProjectInstancePriority } from '../value-objects/project-instance-priority.vo';

export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface ProjectInstance {
  id: string;
  name: ProjectInstanceName;
  description: ProjectInstanceDescription;
  priority: ProjectInstancePriority;
  status?: ProjectStatus;
  startDate: Date | null;  // 專案預計開始日期，可以為 null (未設定)
  endDate: Date | null;    // 專案預計結束日期，可以為 null (未設定)
  createdBy: ProjectInstanceCreatedBy;
  createdAt: Date;         // 專案建立時間，系統自動設置，一定有值
  updatedAt: Date;         // 專案最後更新時間，系統自動設置，一定有值
}

export interface CreateProjectInstanceProps {
  name: ProjectInstanceName;
  description?: ProjectInstanceDescription;
  priority?: ProjectInstancePriority;
  status?: ProjectStatus;
  startDate?: Date | null; // 專案預計開始日期，可選參數
  endDate?: Date | null;   // 專案預計結束日期，可選參數
  createdBy: ProjectInstanceCreatedBy;
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
