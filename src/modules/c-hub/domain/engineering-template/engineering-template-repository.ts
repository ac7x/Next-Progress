import { CreateEngineeringTemplateProps, EngineeringTemplate, UpdateEngineeringTemplateProps } from './engineering-template-entity';

export interface IEngineeringTemplateRepository {
  create(data: CreateEngineeringTemplateProps): Promise<EngineeringTemplate>;
  list(): Promise<EngineeringTemplate[]>;
  getById(id: string): Promise<EngineeringTemplate | null>;
  update(id: string, data: UpdateEngineeringTemplateProps): Promise<EngineeringTemplate>;
  delete(id: string): Promise<void>;
}
