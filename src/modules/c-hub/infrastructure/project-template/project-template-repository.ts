import { CreateProjectTemplateProps, ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { IProjectTemplateRepository } from '@/modules/c-hub/domain/project-template/project-template-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';

// 只負責專案模板的 CRUD 資料存取
export class ProjectTemplateRepository implements IProjectTemplateRepository {
  async create(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
    // Prisma schema 已保證 priority 為 number（預設 0），不會為 null
    return prisma.projectTemplate.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        priority: data.priority ?? 0,
      },
    }) as unknown as ProjectTemplate;
  }

  async list(): Promise<ProjectTemplate[]> {
    // Prisma schema 已保證 priority 為 number（預設 0），不會為 null
    return prisma.projectTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    }) as unknown as ProjectTemplate[];
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.projectTemplate.delete({
        where: { id },
      });
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
    }) as unknown as ProjectTemplate;
  }

  async getById(id: string): Promise<ProjectTemplate | null> {
    // Prisma schema 已保證 priority 為 number（預設 0），不會為 null
    return prisma.projectTemplate.findFirst({
      where: {
        id,
      },
    }) as unknown as ProjectTemplate | null;
  }
}

export const projectTemplateRepository = new ProjectTemplateRepository();