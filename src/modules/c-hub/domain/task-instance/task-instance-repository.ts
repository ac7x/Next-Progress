import { CreateTaskInstanceProps, TaskInstance } from './task-instance-entity';

export interface ITaskInstanceRepository {
  create(data: CreateTaskInstanceProps): Promise<TaskInstance>;
  // 其他方法定義...
  findByProjectId?(projectId: string): Promise<TaskInstance[]>;
}
