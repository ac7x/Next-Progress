import { SubTaskInstance, SubTaskInstanceStatus } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import type { SubTaskInstance as PrismaSubTaskInstance } from '@prisma/client';

export const subTaskAdapter = {
  toDomain(prismaSubTaskInstance: PrismaSubTaskInstance): SubTaskInstance {
    return {
      id: prismaSubTaskInstance.id,
      name: prismaSubTaskInstance.name,
      description: prismaSubTaskInstance.description,
      plannedStart: prismaSubTaskInstance.plannedStart,
      plannedEnd: prismaSubTaskInstance.plannedEnd,
      equipmentCount: prismaSubTaskInstance.equipmentCount,
      actualEquipmentCount: prismaSubTaskInstance.actualEquipmentCount ?? 0,
      startDate: prismaSubTaskInstance.startDate,
      endDate: prismaSubTaskInstance.endDate,
      priority: prismaSubTaskInstance.priority ?? 0,
      status: (prismaSubTaskInstance.status || 'TODO') as SubTaskInstanceStatus,
      completionRate: prismaSubTaskInstance.completionRate || 0,
      taskId: prismaSubTaskInstance.taskId,
      parentTaskId: prismaSubTaskInstance.parentTaskId || null,
      createdAt: prismaSubTaskInstance.createdAt,
      updatedAt: prismaSubTaskInstance.updatedAt
    };
  }
};
