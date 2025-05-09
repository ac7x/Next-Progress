import { CreateSubTaskTemplateProps, SubTaskTemplate, UpdateSubTaskTemplateProps } from '@/modules/c-hub/domain/sub-task-template/entities/sub-task-template-entity';
import { ISubTaskTemplateRepository } from '@/modules/c-hub/domain/sub-task-template/repositories/sub-task-template-repository-interface';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';
import { subTaskTemplateAdapter } from './sub-task-template-adapter';

export class SubTaskTemplateRepository implements ISubTaskTemplateRepository {
  async create(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate> {
    try {
      // 準備符合 Prisma 模型的數據
      const createData = {
        name: data.name,
        description: data.description,
        priority: data.priority ?? 0,
        isMandatory: true,
        orderIndex: 0,
        parentTemplateId: data.parentTemplateId ?? null // P0d62
      };

      // 創建子任務模板
      const prismaTemplate = await prisma.subTaskTemplate.create({
        data: createData
      });

      // 如果提供了任務模板ID，則創建關聯
      if (data.taskTemplateId) {
        await prisma.taskTemplateSubTaskTemplate.create({
          data: {
            taskTemplateId: data.taskTemplateId,
            subTaskTemplateId: prismaTemplate.id,
            orderIndex: 0
          }
        });
      }

      // 獲取關聯信息
      const relation = data.taskTemplateId ?
        await prisma.taskTemplateSubTaskTemplate.findFirst({
          where: { subTaskTemplateId: prismaTemplate.id }
        }) : null;

      return subTaskTemplateAdapter.toDomain(prismaTemplate, {
        taskTemplateRelation: relation
      });
    } catch (error) {
      console.error('Failed to create sub-task template:', error);
      throw error;
    }
  }

  async list(): Promise<SubTaskTemplate[]> {
    // 查詢所有子任務模板
    const prismaTemplates = await prisma.subTaskTemplate.findMany();

    // 查詢所有關聯
    const relations = await prisma.taskTemplateSubTaskTemplate.findMany();

    // 創建一個映射表，用於快速查找子任務模板的關聯
    const relationMap = new Map();
    relations.forEach(relation => {
      relationMap.set(relation.subTaskTemplateId, relation);
    });

    // 轉換為領域模型
    return prismaTemplates.map(template => {
      const relation = relationMap.get(template.id);
      return subTaskTemplateAdapter.toDomain(template, { taskTemplateRelation: relation });
    });
  }

  async getById(id: string): Promise<SubTaskTemplate | null> {
    // 獲取子任務模板
    const template = await prisma.subTaskTemplate.findUnique({
      where: { id }
    });

    if (!template) return null;

    // 獲取關聯
    const relation = await prisma.taskTemplateSubTaskTemplate.findFirst({
      where: { subTaskTemplateId: id }
    });

    return subTaskTemplateAdapter.toDomain(template, { taskTemplateRelation: relation });
  }

  async update(id: string, data: Partial<UpdateSubTaskTemplateProps>): Promise<SubTaskTemplate> {
    // 準備更新數據
    const updateData: Prisma.SubTaskTemplateUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.parentTemplateId !== undefined) updateData.parentTemplateId = data.parentTemplateId; // Pf3fd

    // 更新子任務模板
    const prismaTemplate = await prisma.subTaskTemplate.update({
      where: { id },
      data: updateData
    });

    // 如果提供了任務模板ID，則更新關聯
    if (data.taskTemplateId !== undefined) {
      // 查找現有關聯
      const existingRelation = await prisma.taskTemplateSubTaskTemplate.findFirst({
        where: { subTaskTemplateId: id }
      });

      // 如果有現有關聯但任務模板ID不同，則更新關聯
      if (existingRelation) {
        if (existingRelation.taskTemplateId !== data.taskTemplateId) {
          await prisma.taskTemplateSubTaskTemplate.update({
            where: { id: existingRelation.id },
            data: { taskTemplateId: data.taskTemplateId }
          });
        }
      }
      // 如果沒有現有關聯但提供了任務模板ID，則創建新關聯
      else if (data.taskTemplateId) {
        await prisma.taskTemplateSubTaskTemplate.create({
          data: {
            taskTemplateId: data.taskTemplateId,
            subTaskTemplateId: id,
            orderIndex: 0
          }
        });
      }
    }

    // 獲取更新後的關聯
    const relation = await prisma.taskTemplateSubTaskTemplate.findFirst({
      where: { subTaskTemplateId: id }
    });

    return subTaskTemplateAdapter.toDomain(prismaTemplate, { taskTemplateRelation: relation });
  }

  async delete(id: string): Promise<void> {
    try {
      // 先刪除關聯
      await prisma.taskTemplateSubTaskTemplate.deleteMany({
        where: { subTaskTemplateId: id }
      });

      // 然後刪除模板
      await prisma.subTaskTemplate.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`ID為 ${id} 的子任務模板不存在或已被刪除`);
        return;
      }
      console.error('Delete sub-task template error:', error);
      throw error;
    }
  }

  async findByTaskTemplateId(taskTemplateId: string): Promise<SubTaskTemplate[]> {
    try {
      // 優化：使用單次查詢獲取所有關係及子任務模板
      const relations = await prisma.taskTemplateSubTaskTemplate.findMany({
        where: {
          taskTemplateId: taskTemplateId
        },
        include: {
          subTaskTemplate: true
        }
      });

      if (relations.length === 0) {
        return [];
      }

      // 直接從關係中映射子任務模板
      return relations.map(relation => {
        return subTaskTemplateAdapter.toDomain(relation.subTaskTemplate, {
          taskTemplateRelation: relation
        });
      });
    } catch (error) {
      console.error('Failed to find sub-task templates by task template ID:', error);
      return [];
    }
  }
}

export const subTaskTemplateRepository = new SubTaskTemplateRepository();
