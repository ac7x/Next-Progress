import { CreateEngineeringFromTemplateProps } from '../engineering-template/engineering-template-entity';
import { CreateEngineeringInstanceProps, EngineeringInstance } from './engineering-instance-entity';
import { IEngineeringInstanceRepository } from './engineering-instance-repository';

export interface IEngineeringInstanceDomainService {
  list(): Promise<EngineeringInstance[]>;
  getById(id: string): Promise<EngineeringInstance | null>;
  create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance>;
  createFromTemplate(data: CreateEngineeringFromTemplateProps): Promise<EngineeringInstance>;
}

export class EngineeringInstanceDomainService implements IEngineeringInstanceDomainService {
  constructor(
    private readonly repository: IEngineeringInstanceRepository,
    private readonly templateRepository: any,  // 工程模板倉庫
    private readonly taskTemplateRepository?: any  // 任務模板倉庫
  ) { }

  async list(): Promise<EngineeringInstance[]> {
    return this.repository.list();
  }

  async getById(id: string): Promise<EngineeringInstance | null> {
    return this.repository.getById(id);
  }

  async create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance> {
    if (!data.name || !data.name.trim()) {
      throw new Error('工程名稱不能為空');
    }

    if (!data.projectId || !data.projectId.trim()) {
      throw new Error('工程必須屬於某個專案');
    }

    return this.repository.create(data);
  }

  async createFromTemplate(data: CreateEngineeringFromTemplateProps): Promise<EngineeringInstance> {
    if (!data.engineeringTemplateId || !data.engineeringTemplateId.trim()) {
      throw new Error('工程模板ID不能為空');
    }

    if (!data.projectId || !data.projectId.trim()) {
      throw new Error('專案ID不能為空');
    }

    // 獲取模板詳情
    const template = await this.templateRepository.getById(data.engineeringTemplateId);
    if (!template) {
      throw new Error('找不到指定的工程模板');
    }

    // 使用模板數據創建工程
    const engineeringData: CreateEngineeringInstanceProps = {
      name: data.name || template.name,
      description: data.description || template.description,
      projectId: data.projectId,
      userId: data.userId || 'system'
    };

    return this.repository.create(engineeringData);
  }
}
