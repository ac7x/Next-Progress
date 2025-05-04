import { CreateTaskInstanceProps, TaskInstance } from '@/modules/c-hub/domain/task-instance/task-instance-entity';
import { ITaskInstanceRepository } from '@/modules/c-hub/domain/task-instance/task-instance-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { taskInstanceAdapter } from './task-instance-adapter';

export class TaskInstanceRepository implements ITaskInstanceRepository {
  async create(data: CreateTaskInstanceProps): Promise<TaskInstance> {
    try {
      // 首先檢索工程以獲取其專案ID
      let projectId = data.projectId;

      // 如果沒有直接提供專案ID但有工程ID，則從工程中獲取專案ID
      if (!projectId && data.engineeringId) {
        const engineering = await prisma.engineeringInstance.findUnique({
          where: { id: data.engineeringId },
          select: { projectId: true }
        });

        if (engineering) {
          projectId = engineering.projectId;
        }
      }

      if (!projectId) {
        throw new Error('Creating task requires either a projectId or a valid engineeringId with associated project');
      }

      // 準備創建數據，確保符合 Prisma 模型預期
      const createData: any = {
        name: data.name,
        description: data.description,
        plannedStart: data.plannedStart || null,
        plannedEnd: data.plannedEnd || null,
        equipmentCount: data.equipmentCount || null,
        actualEquipmentCount: data.actualEquipmentCount || null,
        status: data.status || 'TODO',
        priority: data.priority ?? 0,
        completionRate: data.completionRate || 0,
        project: {
          connect: { id: projectId }
        }
      };

      // 條件性添加 engineering 連接，確保符合 Prisma 類型
      if (data.engineeringId) {
        createData.engineering = {
          connect: { id: data.engineeringId }
        };
      }

      const prismaTaskInstance = await prisma.taskInstance.create({
        data: createData,
        include: {
          engineering: true,
          project: true
        }
      });

      return taskInstanceAdapter.toDomain(prismaTaskInstance);
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  async findByProjectId(projectId: string): Promise<TaskInstance[]> {
    try {
      // 查詢所有任務
      const taskInstances = await prisma.taskInstance.findMany({
        where: { projectId },
        include: {
          engineering: true,
          project: true
        },
        orderBy: {
          priority: 'asc'
        }
      });

      // 批量查詢所有子任務
      const taskInstanceIds = taskInstances.map(t => t.id);
      const subTaskInstances = await prisma.subTaskInstance.findMany({
        where: { taskId: { in: taskInstanceIds } },
        select: { taskId: true, actualEquipmentCount: true }
      });

      // 分組加總每個任務的 actualEquipmentCount
      const actualCountMap: Record<string, number> = {};
      for (const sub of subTaskInstances) {
        if (!actualCountMap[sub.taskId]) actualCountMap[sub.taskId] = 0;
        actualCountMap[sub.taskId] += sub.actualEquipmentCount ?? 0;
      }

      // 將加總結果合併進任務
      return taskInstances.map(taskInstance => {
        const domainTaskInstance = taskInstanceAdapter.toDomain(taskInstance);
        return {
          ...domainTaskInstance,
          actualEquipmentCount: actualCountMap[taskInstance.id] ?? 0
        };
      });
    } catch (error) {
      console.error('Failed to find tasks by project ID:', error);
      return [];
    }
  }

  // 其他方法實現...
}

export const taskInstanceRepository = new TaskInstanceRepository();
