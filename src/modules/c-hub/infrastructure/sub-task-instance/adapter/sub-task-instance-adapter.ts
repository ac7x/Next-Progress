import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/entities/sub-task-instance-entity';
import { SubTaskInstance as PrismaSubTaskInstance } from '@prisma/client';

/**
 * 子任務實體適配器
 * 負責將 Prisma 模型轉換為領域模型，以及將領域模型轉換回 Prisma 模型
 */
export class SubTaskInstanceAdapter {
  /**
   * 將 Prisma 子任務模型轉換為領域模型
   * @param prismaSubTask Prisma 子任務模型
   * @returns 領域子任務模型
   */
  toDomain(prismaSubTask: PrismaSubTaskInstance): SubTaskInstance {
    return {
      id: prismaSubTask.id,
      name: prismaSubTask.name,
      description: prismaSubTask.description,
      plannedStart: prismaSubTask.plannedStart,
      plannedEnd: prismaSubTask.plannedEnd,
      equipmentCount: prismaSubTask.equipmentCount,
      actualEquipmentCount: prismaSubTask.actualEquipmentCount,
      startDate: prismaSubTask.startDate,
      endDate: prismaSubTask.endDate,
      priority: prismaSubTask.priority ?? 0, // 確保非空值
      status: prismaSubTask.status as any,
      completionRate: prismaSubTask.completionRate ?? 0, // 確保非空值
      taskId: prismaSubTask.taskId,
      parentTaskId: prismaSubTask.parentTaskId,
      createdAt: prismaSubTask.createdAt,
      updatedAt: prismaSubTask.updatedAt
    };
  }

  /**
   * 將領域子任務模型轉換為 Prisma 模型創建數據
   * @param domainSubTask 領域子任務模型
   * @returns Prisma 子任務創建數據
   */
  toPrismaCreateInput(domainSubTask: Partial<SubTaskInstance>): any {
    return {
      name: domainSubTask.name,
      description: domainSubTask.description ?? null,
      plannedStart: domainSubTask.plannedStart ?? null,
      plannedEnd: domainSubTask.plannedEnd ?? null,
      equipmentCount: domainSubTask.equipmentCount ?? null,
      actualEquipmentCount: domainSubTask.actualEquipmentCount ?? 0,
      startDate: domainSubTask.startDate ?? null,
      endDate: domainSubTask.endDate ?? null,
      priority: domainSubTask.priority ?? 0, // 確保非空數值
      status: domainSubTask.status ?? 'TODO',
      completionRate: domainSubTask.completionRate ?? 0, // 確保非空數值
      taskId: domainSubTask.taskId,
      parentTaskId: domainSubTask.parentTaskId ?? null
    };
  }

  /**
   * 將領域子任務模型轉換為 Prisma 模型更新數據
   * @param domainSubTask 領域子任務模型
   * @returns Prisma 子任務更新數據
   */
  toPrismaUpdateInput(domainSubTask: Partial<SubTaskInstance>): any {
    const updateData: any = {};

    if (domainSubTask.name !== undefined) updateData.name = domainSubTask.name;
    if (domainSubTask.description !== undefined) updateData.description = domainSubTask.description;
    if (domainSubTask.plannedStart !== undefined) updateData.plannedStart = domainSubTask.plannedStart;
    if (domainSubTask.plannedEnd !== undefined) updateData.plannedEnd = domainSubTask.plannedEnd;
    if (domainSubTask.equipmentCount !== undefined) updateData.equipmentCount = domainSubTask.equipmentCount;
    if (domainSubTask.actualEquipmentCount !== undefined) updateData.actualEquipmentCount = domainSubTask.actualEquipmentCount;
    if (domainSubTask.startDate !== undefined) updateData.startDate = domainSubTask.startDate;
    if (domainSubTask.endDate !== undefined) updateData.endDate = domainSubTask.endDate;
    if (domainSubTask.priority !== undefined) updateData.priority = domainSubTask.priority ?? 0; // 確保非空數值
    if (domainSubTask.status !== undefined) updateData.status = domainSubTask.status;
    if (domainSubTask.completionRate !== undefined) updateData.completionRate = domainSubTask.completionRate ?? 0; // 確保非空數值
    if (domainSubTask.parentTaskId !== undefined) updateData.parentTaskId = domainSubTask.parentTaskId;

    return updateData;
  }
}

/**
 * 子任務實體適配器實例
 * 用於倉儲層和應用服務層
 */
export const subTaskAdapter = new SubTaskInstanceAdapter();
