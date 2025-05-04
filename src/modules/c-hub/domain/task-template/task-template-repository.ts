import { CreateTaskTemplateProps, TaskTemplate } from './task-template-entity';

export interface ITaskTemplateRepository {
  create(data: CreateTaskTemplateProps): Promise<TaskTemplate>;
  list(): Promise<TaskTemplate[]>;
  getById(id: string): Promise<TaskTemplate | null>;
  update(id: string, data: Partial<CreateTaskTemplateProps>): Promise<TaskTemplate>;
  delete(id: string): Promise<void>;
  findByEngineeringTemplateId(engineeringTemplateId: string): Promise<TaskTemplate[]>;
}
