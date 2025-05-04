import { CreateSubTaskTemplateProps, SubTaskTemplate } from './sub-task-template-entity';

export interface ISubTaskTemplateRepository {
  create(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate>;
  list(): Promise<SubTaskTemplate[]>;
  getById(id: string): Promise<SubTaskTemplate | null>;
  update(id: string, data: Partial<CreateSubTaskTemplateProps>): Promise<SubTaskTemplate>;
  delete(id: string): Promise<void>;
  findByTaskTemplateId(taskTemplateId: string): Promise<SubTaskTemplate[]>;
}
