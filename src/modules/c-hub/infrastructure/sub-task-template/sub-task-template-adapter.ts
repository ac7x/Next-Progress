import { CreateSubTaskTemplateProps, SubTaskTemplate } from '@/modules/c-hub/domain/sub-task-template/sub-task-template-entity';
import type { Prisma, SubTaskTemplate as PrismaSubTaskTemplate, TaskTemplateSubTaskTemplate } from '@prisma/client';

interface AdditionalData extends Partial<CreateSubTaskTemplateProps> {
  taskTemplate?: Prisma.TaskTemplateGetPayload<{}> | null;
  taskTemplateRelation?: TaskTemplateSubTaskTemplate | null;
}

export const subTaskTemplateAdapter = {
  toDomain(
    prismaModel: PrismaSubTaskTemplate,
    additionalData?: AdditionalData
  ): SubTaskTemplate {
    // 從中介表關聯或附加數據中獲取任務模板ID
    const taskTemplateId = additionalData?.taskTemplateRelation?.taskTemplateId ||
      additionalData?.taskTemplateId ||
      '';

    // 轉換為領域實體
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      plannedStart: prismaModel.plannedStart,
      plannedEnd: prismaModel.plannedEnd,
      equipmentCount: prismaModel.equipmentCount,
      priority: prismaModel.priority ?? additionalData?.priority ?? 0,
      status: prismaModel.status || 'pending',
      completionRate: prismaModel.completionRate ?? 0,
      isMandatory: prismaModel.isMandatory ?? true,
      orderIndex: prismaModel.orderIndex ?? 0,
      parentTemplateId: prismaModel.parentTemplateId,
      taskTemplateId, // 從關聯表或附加數據中獲取
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  },

  toPersistence(domainModel: Partial<SubTaskTemplate>): Prisma.SubTaskTemplateUpdateInput {
    const data: Prisma.SubTaskTemplateUpdateInput = {};
    if (domainModel.name !== undefined) data.name = domainModel.name;
    if (domainModel.description !== undefined) data.description = domainModel.description;
    if (domainModel.plannedStart !== undefined) data.plannedStart = domainModel.plannedStart;
    if (domainModel.plannedEnd !== undefined) data.plannedEnd = domainModel.plannedEnd;
    if (domainModel.equipmentCount !== undefined) data.equipmentCount = domainModel.equipmentCount;
    if (domainModel.status !== undefined) data.status = domainModel.status;
    if (domainModel.completionRate !== undefined) data.completionRate = domainModel.completionRate;
    if (domainModel.isMandatory !== undefined) data.isMandatory = domainModel.isMandatory;
    if (domainModel.orderIndex !== undefined) data.orderIndex = domainModel.orderIndex;
    if (domainModel.parentTemplateId !== undefined) data.parentTemplateId = domainModel.parentTemplateId;
    if (domainModel.priority !== undefined) data.priority = domainModel.priority;

    return data;
  }
};
