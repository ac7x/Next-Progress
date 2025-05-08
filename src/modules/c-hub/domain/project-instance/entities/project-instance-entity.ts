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
  startDate: Date | null;
  endDate: Date | null;
  createdBy: ProjectInstanceCreatedBy;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInstanceProps {
  name: ProjectInstanceName;
  description?: ProjectInstanceDescription;
  priority?: ProjectInstancePriority;
  status?: ProjectStatus;
  startDate?: Date | null;
  endDate?: Date | null;
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
