import { CreateEngineeringInstanceProps, EngineeringInstance } from './engineering-instance-entity';

export interface IEngineeringInstanceRepository {
  list(): Promise<EngineeringInstance[]>;
  getById(id: string): Promise<EngineeringInstance | null>;
  create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance>;
  listByProject(projectId: string): Promise<EngineeringInstance[]>;
}
