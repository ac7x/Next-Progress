import { CreateEngineeringInstanceProps, EngineeringInstance } from './engineering-instance-entity';
import { IEngineeringInstanceRepository } from './engineering-instance-repository';

export class EngineeringInstanceDomainService {
  constructor(private readonly repository: IEngineeringInstanceRepository) { }

  async list(): Promise<EngineeringInstance[]> {
    return this.repository.list();
  }

  async getById(id: string): Promise<EngineeringInstance | null> {
    if (!id?.trim()) throw new Error('工程ID不能為空');
    return this.repository.getById(id);
  }

  async create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance> {
    if (!data.name?.trim()) throw new Error('工程名稱不能為空');
    if (!data.projectId?.trim()) throw new Error('必須指定專案ID');
    return this.repository.create(data);
  }

  async listByProject(projectId: string): Promise<EngineeringInstance[]> {
    if (!projectId?.trim()) throw new Error('專案ID不能為空');
    return this.repository.listByProject(projectId);
  }
}
