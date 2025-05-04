import { CreateProjectTemplateProps, ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { IProjectTemplateRepository } from '@/modules/c-hub/domain/project-template/project-template-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';

export class ProjectTemplateRepository implements IProjectTemplateRepository {
  async create(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
    return prisma.projectTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  async list(): Promise<ProjectTemplate[]> {
    return prisma.projectTemplate.findMany({
      where: {
        isActive: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    try {
      // 使用邏輯刪除而非物理刪除
      const result = await prisma.projectTemplate.updateMany({
        where: { id },
        data: { isActive: false },
      });

      if (result.count === 0) {
        console.warn(`ID為 ${id} 的專案模板不存在或已被刪除`);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`ID為 ${id} 的專案模板不存在或已被刪除`);
        return;
      }
      console.error('Delete project template error:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<CreateProjectTemplateProps>): Promise<ProjectTemplate> {
    return prisma.projectTemplate.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async getById(id: string): Promise<ProjectTemplate | null> {
    return prisma.projectTemplate.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }
}

export const projectTemplateRepository = new ProjectTemplateRepository();