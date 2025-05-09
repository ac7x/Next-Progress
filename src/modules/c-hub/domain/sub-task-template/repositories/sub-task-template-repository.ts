import { CreateSubTaskTemplateProps, SubTaskTemplate } from '../sub-task-template-entity';
import { ISubTaskTemplateRepository } from '../sub-task-template-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';
import { subTaskTemplateAdapter } from '@/modules/c-hub/infrastructure/sub-task-template/sub-task-template-adapter';

export class SubTaskTemplateRepository implements ISubTaskTemplateRepository {
  async create(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate> {
    try {
      const createData = {
        name: data.name,
        description: data.description,
        priority: data.priority ?? 0,
        isMandatory: true,
        orderIndex: 0,
        parentTemplateId: data.parentTemplateId ?? null,
      };

      const prismaTemplate = await prisma.subTaskTemplate.create({ data: createData });

      if (data.taskTemplateId) {
        await prisma.taskTemplateSubTaskTemplate.create({
          data: {
            taskTemplateId: data.taskTemplateId,
            subTaskTemplateId: prismaTemplate.id,
            orderIndex: 0,
          },
        });
      }

      const relation = data.taskTemplateId
        ? await prisma.taskTemplateSubTaskTemplate.findFirst({
            where: { subTaskTemplateId: prismaTemplate.id },
          })
        : null;

      return subTaskTemplateAdapter.toDomain(prismaTemplate, { taskTemplateRelation: relation });
    } catch (error) {
      console.error('Failed to create sub-task template:', error);
      throw error;
    }
  }

  async list(): Promise<SubTaskTemplate[]> {
    const prismaTemplates = await prisma.subTaskTemplate.findMany();
    const relations = await prisma.taskTemplateSubTaskTemplate.findMany();

    const relationMap = new Map();
    relations.forEach((relation) => {
      relationMap.set(relation.subTaskTemplateId, relation);
    });

    return prismaTemplates.map((template) => {
      const relation = relationMap.get(template.id);
      return subTaskTemplateAdapter.toDomain(template, { taskTemplateRelation: relation });
    });
  }

  async getById(id: string): Promise<SubTaskTemplate | null> {
    const template = await prisma.subTaskTemplate.findUnique({ where: { id } });
    if (!template) return null;

    const relation = await prisma.taskTemplateSubTaskTemplate.findFirst({
      where: { subTaskTemplateId: id },
    });

    return subTaskTemplateAdapter.toDomain(template, { taskTemplateRelation: relation });
  }

  async update(id: string, data: Partial<CreateSubTaskTemplateProps>): Promise<SubTaskTemplate> {
    const updateData: Prisma.SubTaskTemplateUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.parentTemplateId !== undefined) updateData.parentTemplateId = data.parentTemplateId;

    const prismaTemplate = await prisma.subTaskTemplate.update({
      where: { id },
      data: updateData,
    });

    if (data.taskTemplateId !== undefined) {
      const existingRelation = await prisma.taskTemplateSubTaskTemplate.findFirst({
        where: { subTaskTemplateId: id },
      });

      if (existingRelation) {
        if (existingRelation.taskTemplateId !== data.taskTemplateId) {
          await prisma.taskTemplateSubTaskTemplate.update({
            where: { id: existingRelation.id },
            data: { taskTemplateId: data.taskTemplateId },
          });
        }
      } else if (data.taskTemplateId) {
        await prisma.taskTemplateSubTaskTemplate.create({
          data: {
            taskTemplateId: data.taskTemplateId,
            subTaskTemplateId: id,
            orderIndex: 0,
          },
        });
      }
    }

    const relation = await prisma.taskTemplateSubTaskTemplate.findFirst({
      where: { subTaskTemplateId: id },
    });

    return subTaskTemplateAdapter.toDomain(prismaTemplate, { taskTemplateRelation: relation });
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.taskTemplateSubTaskTemplate.deleteMany({ where: { subTaskTemplateId: id } });
      await prisma.subTaskTemplate.delete({ where: { id } });
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
      const relations = await prisma.taskTemplateSubTaskTemplate.findMany({
        where: { taskTemplateId },
        include: { subTaskTemplate: true },
      });

      if (relations.length === 0) return [];

      return relations.map((relation) =>
        subTaskTemplateAdapter.toDomain(relation.subTaskTemplate, { taskTemplateRelation: relation })
      );
    } catch (error) {
      console.error('Failed to find sub-task templates by task template ID:', error);
      return [];
    }
  }
}

export const subTaskTemplateRepository = new SubTaskTemplateRepository();
