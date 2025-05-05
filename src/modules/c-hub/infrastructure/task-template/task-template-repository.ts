import { CreateTaskTemplateProps, TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { ITaskTemplateRepository } from '@/modules/c-hub/domain/task-template/task-template-repository';
import { TemplateTypes } from '@/modules/c-hub/domain/template-relation/template-relation-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma, TemplateRelation } from '@prisma/client';
import { taskTemplateAdapter } from './task-template-adapter';

export class TaskTemplateRepository implements ITaskTemplateRepository {
  async create(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
    try {
      // 準備符合 Prisma 模型的數據
      const createData: Prisma.TaskTemplateCreateInput = {
        name: data.name,
        description: data.description,
        priority: data.priority ?? 0
      };

      const prismaTemplate = await prisma.taskTemplate.create({
        data: createData
      });

      // 使用適配器將 Prisma 模型映射到領域實體
      return taskTemplateAdapter.toDomain(prismaTemplate, data);
    } catch (error) {
      console.error('Failed to create task template:', error);
      throw error;
    }
  }

  async list(): Promise<TaskTemplate[]> {
    const prismaTemplates = await prisma.taskTemplate.findMany();
    return prismaTemplates.map(template => taskTemplateAdapter.toDomain(template));
  }

  async getById(id: string): Promise<TaskTemplate | null> {
    const template = await prisma.taskTemplate.findUnique({
      where: { id }
    });

    if (!template) return null;

    return taskTemplateAdapter.toDomain(template);
  }

  async update(id: string, data: Partial<CreateTaskTemplateProps>): Promise<TaskTemplate> {
    // 準備符合 Prisma 模型的更新數據
    const updateData: Prisma.TaskTemplateUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;

    const prismaTemplate = await prisma.taskTemplate.update({
      where: { id },
      data: updateData
    });

    return taskTemplateAdapter.toDomain(prismaTemplate, data);
  }

  async delete(id: string): Promise<void> {
    try {
      // 使用 deleteMany 而非 delete
      const result = await prisma.taskTemplate.deleteMany({
        where: { id },
      });

      if (result.count === 0) {
        console.warn(`ID為 ${id} 的任務模板不存在或已被刪除`);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`ID為 ${id} 的任務模板不存在或已被刪除`);
        return;
      }
      console.error('Delete task template error:', error);
      throw error;
    }
  }

  // 透過 TemplateRelation 查詢工程模板下的任務模板
  async findByEngineeringTemplateId(engineeringTemplateId: string): Promise<TaskTemplate[]> {
    try {
      // 查詢關聯關係
      const relations = await prisma.templateRelation.findMany({
        where: {
          parentType: TemplateTypes.ENGINEERING_TEMPLATE,
          parentId: engineeringTemplateId,
          childType: TemplateTypes.TASK_TEMPLATE
        },
        orderBy: { orderIndex: 'asc' }
      }) as TemplateRelation[];

      // 獲取所有任務模板ID
      const taskTemplateIds = relations.map((r: TemplateRelation) => r.childId);
      if (taskTemplateIds.length === 0) return [];

      // 查詢所有任務模板詳情
      const prismaTemplates = await prisma.taskTemplate.findMany({
        where: { id: { in: taskTemplateIds } }
      });

      // 按關聯中的順序排序並返回
      const idToTemplate = new Map(prismaTemplates.map(t => [t.id, t]));
      return taskTemplateIds
        .map((id: string) => idToTemplate.get(id))
        .filter((template): template is NonNullable<typeof template> => template !== undefined)
        .map(template => taskTemplateAdapter.toDomain(template));
    } catch (error) {
      console.error(`Failed to find task templates by engineering template ID ${engineeringTemplateId}:`, error);
      throw error;
    }
  }
}

export const taskTemplateRepository = new TaskTemplateRepository();
