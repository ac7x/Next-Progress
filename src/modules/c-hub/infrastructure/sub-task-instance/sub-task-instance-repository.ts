import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateSubTaskInstanceProps, SubTaskInstance, UpdateSubTaskInstanceProps } from '../../domain/sub-task-instance/entities/sub-task-instance-entity';
import { ISubTaskInstanceRepository } from '../../domain/sub-task-instance/repositories/sub-task-instance-repository-interface';
import { subTaskAdapter } from './sub-task-instance-adapter';

/**
 * 子任務實體倉儲實現
 * 負責子任務實體的持久化操作
 */
export class SubTaskInstanceRepository implements ISubTaskInstanceRepository {
  /**
   * 建立新的子任務實體
   * @param data 子任務實體建立資料
   */
  async create(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
      // 準備創建數據
      const createData = subTaskAdapter.toPrismaCreateInput(data);

      const prismaSubTaskInstance = await prisma.subTaskInstance.create({
        data: createData
      });

      return subTaskAdapter.toDomain(prismaSubTaskInstance);
    } catch (error) {
      console.error('Failed to create sub-task:', error);
      throw error;
    }
  }

  /**
   * 取得所有子任務實體列表
   */
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

  /**
   * 透過ID查詢單一子任務實體
   * @param id 子任務實體ID
   */
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

  /**
   * 透過任務ID查詢子任務實體列表
   * @param taskId 任務ID
   */
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

  /**
   * 透過ID更新子任務實體
   * @param id 子任務實體ID
   * @param data 欲更新的資料
   */
  async update(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance> {
    try {
      const updateData = subTaskAdapter.toPrismaUpdateInput(data);

      const prismaSubTask = await prisma.subTaskInstance.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      return subTaskAdapter.toDomain(prismaSubTask);
    } catch (error) {
      console.error('Failed to update sub-task:', error);
      throw error;
    }
  }

  /**
   * 刪除子任務實體
   * @param id 子任務實體ID
   */
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
}

/**
 * 子任務實體倉儲實例
 * 用於應用層和領域服務的注入
 */
export const subTaskInstanceRepository = new SubTaskInstanceRepository();
