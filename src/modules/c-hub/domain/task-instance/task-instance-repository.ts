import { CreateTaskInstanceProps, TaskInstance, UpdateTaskInstanceProps } from './task-instance-entity';

export interface ITaskInstanceRepository {
  create(data: CreateTaskInstanceProps): Promise<TaskInstance>;
  findById(id: string): Promise<TaskInstance | null>;
  findByProjectId(projectId: string): Promise<TaskInstance[]>;
  update(id: string, data: UpdateTaskInstanceProps): Promise<TaskInstance>;
  list(): Promise<TaskInstance[]>;
}
