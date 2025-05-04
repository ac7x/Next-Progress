import { CreateTaskTemplateProps, TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import type { Prisma, TaskTemplate as PrismaTaskTemplate } from '@prisma/client';

type TaskTemplateWithRelations = PrismaTaskTemplate & {
  engineering?: { id: string; name: string } | null;
};

export const taskTemplateAdapter = {
  toDomain(
    prismaModel: TaskTemplateWithRelations,
    additionalData?: Partial<CreateTaskTemplateProps>
  ): TaskTemplate {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      engineeringId: prismaModel.engineeringId,
      priority: prismaModel.priority ?? additionalData?.priority ?? 0,
      isActive: additionalData?.isActive ?? true,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  },

  toPersistence(domainModel: Partial<TaskTemplate>): Prisma.TaskTemplateUpdateInput {
    const data: Prisma.TaskTemplateUpdateInput = {};

    if (domainModel.name !== undefined) data.name = domainModel.name;
    if (domainModel.description !== undefined) data.description = domainModel.description;

    // 確保 priority 被視為數字類型
    if (domainModel.priority !== undefined) {
      data.priority = domainModel.priority;
    }

    return data;
  }
};
