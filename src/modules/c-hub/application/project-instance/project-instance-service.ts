import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { projectInstanceRepository } from '@/modules/c-hub/infrastructure/project-instance/project-instance-repository';
import { getProjectTemplateQuery } from '../project-template/project-template-actions'; // 修正 import

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
    // 獲取模板詳情
    const template = await getProjectTemplateQuery(templateId); // 修正名稱
    if (!template) {
      throw new Error('找不到指定的專案模板');
    }

    // 從模板建立專案
    return projectInstanceRepository.create({
      ...projectData,
      name: projectData.name || template.name,
      description: projectData.description || template.description,
      // 其他屬性從 projectData 獲取
    });
  }
};
