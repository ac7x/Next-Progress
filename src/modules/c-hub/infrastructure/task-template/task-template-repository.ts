import { CreateTaskTemplateProps, ITaskTemplateRepository, TaskTemplate, UpdateTaskTemplateProps } from '@/modules/c-hub/domain/task-template';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';
import { taskTemplateAdapter } from './task-template-adapter';

/**
 * 任務模板存儲庫實現
 * 負責與持久化層交互，實現領域存儲庫接口
 */
export class TaskTemplateRepository implements ITaskTemplateRepository {
  /**
   * 創建任務模板
   * @param data 創建資料
   */
  async create(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
    try {
      const prismaTemplate = await prisma.taskTemplate.create({
        data: {
          name: data.name,
          description: data.description || null,
          engineeringId: data.engineeringId || null,
          priority: data.priority ?? 0,
          // isActive 不是 Prisma 模型中的欄位，移除
        },
      });

      // 在 adapter 轉換中加入 isActive 屬性
      return taskTemplateAdapter.toDomain(prismaTemplate, { isActive: data.isActive ?? true });
    } catch (error) {
      console.error('Failed to create task template:', error);
      throw error instanceof Error ? error : new Error('Failed to create task template');
    }
  }

  /**
   * 獲取所有任務模板列表
   */
  async list(): Promise<TaskTemplate[]> {
    try {
      const prismaTemplates = await prisma.taskTemplate.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return prismaTemplates.map(template => taskTemplateAdapter.toDomain(template));
    } catch (error) {
      console.error('Failed to list task templates:', error);
      return [];
    }
  }

  /**
   * 根據ID獲取任務模板
   * @param id 任務模板ID
   */
  async getById(id: string): Promise<TaskTemplate | null> {
    if (!id) return null;

    try {
      const prismaTemplate = await prisma.taskTemplate.findUnique({
        where: { id },
      });

      if (!prismaTemplate) return null;

      return taskTemplateAdapter.toDomain(prismaTemplate);
    } catch (error) {
      console.error(`Failed to get task template with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * 更新任務模板
   * @param id 任務模板ID
   * @param data 更新資料
   */
  async update(id: string, data: UpdateTaskTemplateProps): Promise<TaskTemplate> {
    try {
      const updateData = taskTemplateAdapter.toPersistence(data);

      const prismaTemplate = await prisma.taskTemplate.update({
        where: { id },
        data: updateData,
      });

      return taskTemplateAdapter.toDomain(prismaTemplate);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`ID為 ${id} 的任務模板不存在`);
      }
      console.error(`Failed to update task template with ID ${id}:`, error);
      throw error instanceof Error ? error : new Error('Failed to update task template');
    }
  }

  /**
   * 刪除任務模板
   * @param id 任務模板ID
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.taskTemplate.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`ID為 ${id} 的任務模板不存在或已被刪除`);
        return;
      }
      console.error(`Failed to delete task template with ID ${id}:`, error);
      throw error instanceof Error ? error : new Error('Failed to delete task template');
    }
  }

  /**
   * 根據工程模板ID查找任務模板
   * @param engineeringTemplateId 工程模板ID
   */
  async findByEngineeringTemplateId(engineeringTemplateId: string): Promise<TaskTemplate[]> {
    try {
      const prismaTemplates = await prisma.taskTemplate.findMany({
        where: {
          engineeringId: engineeringTemplateId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return prismaTemplates.map(template => taskTemplateAdapter.toDomain(template));
    } catch (error) {
      console.error(`Failed to find task templates for engineering template ID ${engineeringTemplateId}:`, error);
      return [];
    }
  }
}

// 單例模式導出
export const taskTemplateRepository = new TaskTemplateRepository();
