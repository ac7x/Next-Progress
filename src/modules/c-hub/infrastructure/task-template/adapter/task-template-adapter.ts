import { CreateTaskTemplateProps, TaskTemplate } from '@/modules/c-hub/domain/task-template';
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
      description: prismaModel.description ?? null,
      engineeringId: prismaModel.engineering?.id ?? null,
      priority: prismaModel.priority ?? additionalData?.priority ?? 0,
      // 從 additionalData 中獲取 isActive 值，或預設為 true
      isActive: additionalData?.isActive ?? true,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  },

  toPersistence(domainModel: Partial<TaskTemplate>): Prisma.TaskTemplateUpdateInput {
    const data: Prisma.TaskTemplateUpdateInput = {};

    if (domainModel.name !== undefined) data.name = domainModel.name;
    if (domainModel.description !== undefined) data.description = domainModel.description;

    // 將 engineeringId 正確映射到 Prisma 關係
    if (domainModel.engineeringId !== undefined) {
      data.engineering = domainModel.engineeringId
        ? { connect: { id: domainModel.engineeringId } }
        : { disconnect: true };
    }

    // 確保 priority 被視為數字類型
    if (domainModel.priority !== undefined) {
      data.priority = domainModel.priority;
    }

    // isActive 不是 Prisma 模型的欄位，因此我們不加入到 persistence 資料中

    return data;
  }
};
