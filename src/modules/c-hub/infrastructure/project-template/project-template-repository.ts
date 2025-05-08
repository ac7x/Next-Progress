import { CreateProjectTemplateProps, ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { IProjectTemplateRepository } from '@/modules/c-hub/domain/project-template/project-template-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';

// 只負責專案模板的 CRUD 資料存取
export class ProjectTemplateRepository implements IProjectTemplateRepository {
  async create(data: CreateProjectTemplateProps): Promise<ProjectTemplate> {
    try {
      // Prisma schema 已保證 priority 為 number（預設 0），不會為 null
      return prisma.projectTemplate.create({
        data: {
          name: data.name,
          description: data.description ?? null,
          isActive: data.isActive ?? true,
          priority: data.priority ?? 0,
        },
      }) as unknown as ProjectTemplate;
    } catch (error) {
      console.error('Create project template error:', error);
      throw error instanceof Error ? error : new Error('Failed to create project template');
    }
  }

  async list(): Promise<ProjectTemplate[]> {
    try {
      // Prisma schema 已保證 priority 為 number（預設 0），不會為 null
      return prisma.projectTemplate.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          { priority: 'asc' },
          { createdAt: 'desc' }
        ],
      }) as unknown as ProjectTemplate[];
    } catch (error) {
      console.error('List project templates error:', error);
      throw error instanceof Error ? error : new Error('Failed to list project templates');
    }
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
      throw error instanceof Error ? error : new Error('Failed to delete project template');
    }
  }

  async update(id: string, data: Partial<CreateProjectTemplateProps>): Promise<ProjectTemplate> {
    try {
      return prisma.projectTemplate.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      }) as unknown as ProjectTemplate;
    } catch (error) {
      console.error('Update project template error:', error);
      throw error instanceof Error ? error : new Error('Failed to update project template');
    }
  }

  async getById(id: string): Promise<ProjectTemplate | null> {
    try {
      // Prisma schema 已保證 priority 為 number（預設 0），不會為 null
      return prisma.projectTemplate.findFirst({
        where: {
          id,
          isActive: true,
        },
      }) as unknown as ProjectTemplate | null;
    } catch (error) {
      console.error('Get project template by ID error:', error);
      throw error instanceof Error ? error : new Error('Failed to get project template by ID');
    }
  }
}

export const projectTemplateRepository = new ProjectTemplateRepository();
