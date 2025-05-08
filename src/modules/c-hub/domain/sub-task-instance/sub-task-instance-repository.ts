import { CreateSubTaskInstanceProps, SubTaskInstance, UpdateSubTaskInstanceProps } from './sub-task-instance-entity';

export interface ISubTaskInstanceRepository {
  create(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance>;
  findById(id: string): Promise<SubTaskInstance | null>;
  findByTaskId(taskId: string): Promise<SubTaskInstance[]>;
  update(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance>;
  delete(id: string): Promise<void>;
  list(): Promise<SubTaskInstance[]>;
}
