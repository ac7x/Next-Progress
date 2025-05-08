import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { projectInstanceRepository } from '@/modules/c-hub/infrastructure/project-instance/project-instance-repository';
import { CreateProjectInstanceFromTemplateCommandHandler } from './project-instance.command-handler';

export const projectInstanceService = {
  async create(data: CreateProjectInstanceProps): Promise<ProjectInstance> {
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
  },

  async createFromTemplate(
    templateId: string,
    projectData: Omit<CreateProjectInstanceProps, 'templateId'>
  ): Promise<ProjectInstance> {
    // 統一由 Command Handler 處理
    return CreateProjectInstanceFromTemplateCommandHandler(templateId, projectData);
  }
};
