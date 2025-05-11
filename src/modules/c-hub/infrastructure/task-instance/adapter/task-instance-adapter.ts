import { TaskInstance, TaskInstanceStatusType } from '@/modules/c-hub/domain/task-instance';
import type { TaskInstance as PrismaTaskInstance } from '@prisma/client';

type TaskInstanceWithRelations = PrismaTaskInstance & {
  engineering?: { id: string; name: string } | null;
  project?: { id: string; name: string } | null;
};

export const taskInstanceAdapter = {
  toDomain(prismaTaskInstance: TaskInstanceWithRelations): TaskInstance {
    return {
      id: prismaTaskInstance.id,
      name: prismaTaskInstance.name,
      description: prismaTaskInstance.description,
      plannedStart: prismaTaskInstance.plannedStart,
      plannedEnd: prismaTaskInstance.plannedEnd,
      equipmentCount: prismaTaskInstance.equipmentCount,
      actualEquipmentCount: prismaTaskInstance.actualEquipmentCount ?? 0,
      status: (prismaTaskInstance.status || 'TODO') as TaskInstanceStatusType,
      priority: prismaTaskInstance.priority ?? 0,
      completionRate: prismaTaskInstance.completionRate ?? 0,
      engineeringId: prismaTaskInstance.engineeringId,
      projectId: prismaTaskInstance.projectId,
      createdAt: prismaTaskInstance.createdAt,
      updatedAt: prismaTaskInstance.updatedAt
    };
  }
};
