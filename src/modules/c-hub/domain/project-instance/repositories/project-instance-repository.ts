import { CreateProjectInstanceProps, ProjectInstance } from '../entities/project-instance-entity';

export interface IProjectInstanceRepository {
  create(data: CreateProjectInstanceProps): Promise<ProjectInstance>;
  list(): Promise<ProjectInstance[]>;
  getById(id: string): Promise<ProjectInstance | null>;
  update(id: string, data: Partial<CreateProjectInstanceProps>): Promise<ProjectInstance>;
  delete(id: string): Promise<void>;
}
