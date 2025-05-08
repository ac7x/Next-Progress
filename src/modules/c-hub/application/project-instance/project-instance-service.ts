import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { projectInstanceRepository } from '@/modules/c-hub/infrastructure/project-instance/project-instance-repository';
import { getProjectTemplate } from '../project-template/project-template-queries'; // 改為正確的 Query Handler

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
    // 獲取模板詳情（CQRS Query Concern）
    const template = await getProjectTemplate(templateId); // 使用正確的查詢方法
    if (!template) {
      throw new Error('找不到指定的專案模板');
    }

    // 從模板建立專案，優先以 projectData 為主
    return projectInstanceRepository.create({
      ...projectData,
      name: projectData.name || template.name,
      description: projectData.description ?? template.description,
      priority: projectData.priority ?? template.priority ?? 0,
      // 其他屬性從 projectData 獲取
    });
  }
};
