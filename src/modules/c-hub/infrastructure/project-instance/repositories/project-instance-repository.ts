import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { IProjectInstanceRepository } from '@/modules/c-hub/domain/project-instance/repositories/project-instance-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { projectInstanceAdapter } from '../adapter/project-instance-adapters';

export class ProjectInstanceRepository implements IProjectInstanceRepository {
  async create(data: CreateProjectInstanceProps): Promise<ProjectInstance> {
    const createInput = await projectInstanceAdapter.toCreateInput(data);
    const result = await prisma.projectInstance.create({
      data: createInput, // createInput 已修正，不含 createdBy
    });
    return projectInstanceAdapter.toDomain(result);
  }

  async list(): Promise<ProjectInstance[]> {
    const projects = await prisma.projectInstance.findMany({
      orderBy: [
        { priority: 'asc' }, // 優先級數字越小優先度越高，故使用升序排序
        { createdAt: 'desc' } // 相同優先級時，較新建立的排前面
      ]
    });
    return projects.map(projectInstanceAdapter.toDomain);
  }

  async getById(id: string): Promise<ProjectInstance | null> {
    const project = await prisma.projectInstance.findUnique({ where: { id } });
    return project ? projectInstanceAdapter.toDomain(project) : null;
  }

  async update(id: string, data: Partial<CreateProjectInstanceProps>): Promise<ProjectInstance> {
    // 使用 projectInstanceAdapter.toPersistence 方法處理 null 值
    const updateData = projectInstanceAdapter.toPersistence(data);

    const result = await prisma.projectInstance.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
    return projectInstanceAdapter.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await prisma.projectInstance.delete({ where: { id } });
  }
}

export const projectInstanceRepository = new ProjectInstanceRepository();
