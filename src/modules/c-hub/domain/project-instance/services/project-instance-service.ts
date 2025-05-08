import { projectInstanceRepository } from '@/modules/c-hub/infrastructure/project-instance/project-instance-repository';
import { CreateProjectInstanceProps, ProjectInstance } from '../entities/project-instance-entity';

export const projectInstanceService = {
  async create(data: CreateProjectInstanceProps): Promise<ProjectInstance> {
    // 可加上領域驗證
    return projectInstanceRepository.create(data);
  },
  async list(): Promise<ProjectInstance[]> {
    return projectInstanceRepository.list();
  },
  async getById(id: string): Promise<ProjectInstance | null> {
    return projectInstanceRepository.getById(id);
  },
  async update(id: string, data: Partial<CreateProjectInstanceProps>): Promise<ProjectInstance> {
    return projectInstanceRepository.update(id, data);
  },
  async delete(id: string): Promise<void> {
    return projectInstanceRepository.delete(id);
  }
};
