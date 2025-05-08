import { CreateProjectTemplateProps, ProjectTemplate } from './project-template-entity';

export interface IProjectTemplateRepository {
  create(data: CreateProjectTemplateProps): Promise<ProjectTemplate>;
  list(): Promise<ProjectTemplate[]>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<ProjectTemplate | null>;
  update(id: string, data: Partial<CreateProjectTemplateProps>): Promise<ProjectTemplate>;
}
