import { CreateTaskInstanceProps, TaskInstance, UpdateTaskInstanceProps } from '@/modules/c-hub/domain/task-instance/task-instance-entity';
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
          where: { id: data.engineeringId }
        });

        if (engineering) {
          projectId = engineering.projectId;
        }
      }

      if (!projectId) {
        throw new Error('必須提供專案ID或有效的工程ID');
      }

      // 準備創建數據，確保符合 Prisma 模型預期
      const createData: any = {
        name: data.name,
        description: data.description || null,
        plannedStart: data.plannedStart || null,
        plannedEnd: data.plannedEnd || null,
        equipmentCount: data.equipmentCount || null,
        actualEquipmentCount: data.actualEquipmentCount || null,
        status: data.status || 'TODO',
        priority: data.priority ?? 0,
        completionRate: data.completionRate ?? 0,
        project: { connect: { id: projectId } }
      };

      // 只有在提供 engineeringId 時才添加 engineering 關聯
      if (data.engineeringId) {
        createData.engineering = { connect: { id: data.engineeringId } };
      }

      const prismaTask = await prisma.taskInstance.create({
        data: createData,
        include: {
          engineering: true,
          project: true
        }
      });

      return taskInstanceAdapter.toDomain(prismaTask);
    } catch (error) {
      console.error('Failed to create task instance:', error);
      throw error;
    }
  }

  async findByProjectId(projectId: string): Promise<TaskInstance[]> {
    try {
      const tasks = await prisma.taskInstance.findMany({
        where: { projectId },
        include: {
          engineering: true,
          project: true
        }
      });

      return tasks.map(taskInstanceAdapter.toDomain);
    } catch (error) {
      console.error('Failed to find tasks by project ID:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<TaskInstance | null> {
    try {
      const task = await prisma.taskInstance.findUnique({
        where: { id },
        include: {
          engineering: true,
          project: true
        }
      });

      return task ? taskInstanceAdapter.toDomain(task) : null;
    } catch (error) {
      console.error('Failed to find task by ID:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateTaskInstanceProps): Promise<TaskInstance> {
    try {
      // 準備更新數據，處理特殊關聯
      const updateData: any = { ...data };

      // 如果有工程ID，確保使用 connect
      if (data.engineeringId !== undefined) {
        delete updateData.engineeringId;
        if (data.engineeringId) {
          updateData.engineering = { connect: { id: data.engineeringId } };
        } else {
          updateData.engineering = { disconnect: true };
        }
      }

      // 如果有專案ID，確保使用 connect
      if (data.projectId !== undefined) {
        delete updateData.projectId;
        updateData.project = { connect: { id: data.projectId } };
      }

      // 執行更新操作
      const task = await prisma.taskInstance.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          engineering: true,
          project: true
        }
      });

      return taskInstanceAdapter.toDomain(task);
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  async list(): Promise<TaskInstance[]> {
    try {
      const tasks = await prisma.taskInstance.findMany({
        include: {
          engineering: true,
          project: true
        }
      });

      return tasks.map(taskInstanceAdapter.toDomain);
    } catch (error) {
      console.error('Failed to list tasks:', error);
      throw error;
    }
  }
}

export const taskInstanceRepository = new TaskInstanceRepository();
