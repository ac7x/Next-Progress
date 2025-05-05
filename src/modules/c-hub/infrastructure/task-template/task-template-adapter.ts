import { CreateTaskTemplateProps, TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import type { Prisma, TaskTemplate as PrismaTaskTemplate } from '@prisma/client';

type TaskTemplateWithRelations = PrismaTaskTemplate;

export const taskTemplateAdapter = {
  toDomain(
    prismaModel: TaskTemplateWithRelations,
    additionalData?: Partial<CreateTaskTemplateProps>
  ): TaskTemplate {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      priority: prismaModel.priority ?? additionalData?.priority ?? 0,
      engineeringTemplateId: prismaModel.engineeringTemplateId, // 修正這裡，不用再加 ?? null
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  },

  toPersistence(domainModel: Partial<TaskTemplate>): Prisma.TaskTemplateUpdateInput {
    const data: Prisma.TaskTemplateUpdateInput = {};
    if (domainModel.name !== undefined) data.name = domainModel.name;
    if (domainModel.description !== undefined) data.description = domainModel.description;
    if (domainModel.priority !== undefined) data.priority = domainModel.priority;
    // 使用正確的欄位類型
    if (domainModel.engineeringTemplateId !== undefined) {
      data.engineeringTemplate = domainModel.engineeringTemplateId
        ? { connect: { id: domainModel.engineeringTemplateId } }
        : { disconnect: true };
    }
    return data;
  }
};
