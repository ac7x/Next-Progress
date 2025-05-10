import { CreateTaskInstanceProps, TaskInstance, UpdateTaskInstanceProps } from '@/modules/c-hub/domain/task-instance/entities';
import { TaskInstanceRepository as ITaskInstanceRepository } from '@/modules/c-hub/domain/task-instance/repositories';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { taskInstanceAdapter } from './task-instance-adapter';

/**
 * 任務實例儲存庫實現
 * 負責任務實例數據的持久化操作
 */
export class TaskInstanceRepositoryImpl implements ITaskInstanceRepository {
  /**
   * 創建新任務實例
   */
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

  /**
   * 根據專案 ID 查詢任務
   */
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

  /**
   * 根據 ID 查詢任務
   */
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

  /**
   * 更新任務
   */
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

  /**
   * 刪除任務
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.taskInstance.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  }

  /**
   * 查詢所有任務
   */
  async findAll(): Promise<TaskInstance[]> {
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

  /**
   * 根據工程 ID 查詢任務
   */
  async findByEngineeringId(engineeringId: string): Promise<TaskInstance[]> {
    try {
      const tasks = await prisma.taskInstance.findMany({
        where: { engineeringId },
        include: {
          engineering: true,
          project: true
        }
      });

      return tasks.map(taskInstanceAdapter.toDomain);
    } catch (error) {
      console.error('Failed to find tasks by engineering ID:', error);
      throw error;
    }
  }

  /**
   * 根據過濾條件查詢任務
   */
  async findByFilter(filter: Partial<TaskInstance>): Promise<TaskInstance[]> {
    try {
      // 創建 Prisma 可接受的查詢條件
      const whereCondition: any = {};

      // 只添加非空值到查詢條件
      if (filter.id) whereCondition.id = filter.id;
      if (filter.name) whereCondition.name = filter.name;
      if (filter.status) whereCondition.status = filter.status;
      if (filter.priority !== undefined) whereCondition.priority = filter.priority;
      if (filter.projectId) whereCondition.projectId = filter.projectId;

      // 特別處理可能為 null 的字段
      if (filter.engineeringId !== undefined) {
        whereCondition.engineeringId = filter.engineeringId === null ? null : filter.engineeringId;
      }

      const tasks = await prisma.taskInstance.findMany({
        where: whereCondition,
        include: {
          engineering: true,
          project: true
        }
      });

      return tasks.map(taskInstanceAdapter.toDomain);
    } catch (error) {
      console.error('Failed to find tasks by filter:', error);
      throw error;
    }
  }
}

// 為了向後兼容，繼續暴露一個實例，使其他模塊可以直接使用
export const taskInstanceRepository = new TaskInstanceRepositoryImpl();
