import { CreateSubTaskInstanceProps, SubTaskInstance, UpdateSubTaskInstanceProps } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { ISubTaskInstanceRepository } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { subTaskAdapter } from './sub-task-instance-adapter';

export class SubTaskInstanceRepository implements ISubTaskInstanceRepository {
  async create(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
      // 準備創建數據
      const createData = {
        name: data.name,
        description: data.description || null,
        plannedStart: data.plannedStart || null,
        plannedEnd: data.plannedEnd || null,
        equipmentCount: data.equipmentCount || null,
        actualEquipmentCount: data.actualEquipmentCount ?? 0,
        priority: data.priority || 0,
        status: data.status || 'TODO',
        completionRate: 0,
        taskId: data.taskId,
        parentTaskId: data.parentTaskId || null
      };

      const prismaSubTaskInstance = await prisma.subTaskInstance.create({
        data: createData
      });

      return subTaskAdapter.toDomain(prismaSubTaskInstance);
    } catch (error) {
      console.error('Failed to create sub-task:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<SubTaskInstance | null> {
    try {
      const prismaSubTask = await prisma.subTaskInstance.findUnique({
        where: { id }
      });

      if (!prismaSubTask) return null;

      return subTaskAdapter.toDomain(prismaSubTask);
    } catch (error) {
      console.error('Failed to find sub-task by ID:', error);
      return null;
    }
  }

  async findByTaskId(taskId: string): Promise<SubTaskInstance[]> {
    try {
      const prismaSubTasks = await prisma.subTaskInstance.findMany({
        where: { taskId },
        orderBy: [
          { priority: 'asc' },
          { createdAt: 'asc' }
        ]
      });

      return prismaSubTasks.map(subTaskAdapter.toDomain);
    } catch (error) {
      console.error('Failed to find sub-tasks by task ID:', error);
      return [];
    }
  }

  async update(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
      const prismaSubTask = await prisma.subTaskInstance.update({
        where: { id },
        data: {
          ...data,
          parentTaskId: data.parentTaskId || null,
          updatedAt: new Date()
        }
      });

      return subTaskAdapter.toDomain(prismaSubTask);
    } catch (error) {
      console.error('Failed to update sub-task:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.subTaskInstance.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Failed to delete sub-task:', error);
      throw error;
    }
  }

  async list(): Promise<SubTaskInstance[]> {
    try {
      const prismaSubTasks = await prisma.subTaskInstance.findMany({
        orderBy: [
          { priority: 'asc' },
          { createdAt: 'asc' }
        ]
      });

      return prismaSubTasks.map(subTaskAdapter.toDomain);
    } catch (error) {
      console.error('Failed to list sub-tasks:', error);
      return [];
    }
  }
}

export const subTaskInstanceRepository = new SubTaskInstanceRepository();
