/**
 * 工程實例儲存庫實現 - 負責工程實例實體的持久化操作
 * 使用適配器模式，確保領域模型與持久化實現的分離
 */

import { CreateEngineeringInstanceProps, EngineeringInstance, UpdateEngineeringInstanceProps } from '@/modules/c-hub/domain/engineering-instance/entities/engineering-instance-entity';
import { IEngineeringInstanceRepository } from '@/modules/c-hub/domain/engineering-instance/repositories/engineering-instance-repository-interface';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { engineeringInstanceAdapter } from './engineering-instance-adapter';

export class EngineeringInstanceRepository implements IEngineeringInstanceRepository {
  /**
   * 獲取所有工程實例
   * @returns 工程實例列表
   */
  async list(): Promise<EngineeringInstance[]> {
    const engineerings = await prisma.engineeringInstance.findMany();
    return engineerings.map(engineeringInstanceAdapter.toDomain);
  }

  /**
   * 根據ID獲取工程實例
   * @param id 工程實例ID
   * @returns 工程實例或null
   */
  async getById(id: string): Promise<EngineeringInstance | null> {
    const engineering = await prisma.engineeringInstance.findUnique({
      where: { id }
    });
    return engineering ? engineeringInstanceAdapter.toDomain(engineering) : null;
  }

  /**
   * 創建新工程實例
   * @param data 創建工程實例所需資料
   * @returns 創建的工程實例
   */
  async create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance> {
    try {
      // 尋找或創建用戶
      const userId = data.userId || 'system';
      let user = await prisma.user.findFirst({ where: { userId } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            userId,
            displayName: `User ${userId}`,
            role: 'USER'
          }
        });
      }

      // 創建工程
      const engineering = await prisma.engineeringInstance.create({
        data: {
          name: data.name,
          description: data.description || null,
          project: {
            connect: { id: data.projectId }
          },
          user: {
            connect: { id: user.id }
          }
        }
      });

      return engineeringInstanceAdapter.toDomain(engineering);
    } catch (error) {
      console.error('Failed to create engineering:', error);
      throw error;
    }
  }

  /**
   * 更新工程實例
   * @param id 工程實例ID
   * @param data 更新資料
   * @returns 更新後的工程實例
   */
  async update(id: string, data: UpdateEngineeringInstanceProps): Promise<EngineeringInstance> {
    const updateData = engineeringInstanceAdapter.toPersistence(data);

    const engineering = await prisma.engineeringInstance.update({
      where: { id },
      data: updateData
    });

    return engineeringInstanceAdapter.toDomain(engineering);
  }

  /**
   * 刪除工程實例
   * @param id 工程實例ID
   */
  async delete(id: string): Promise<void> {
    await prisma.engineeringInstance.delete({
      where: { id }
    });
  }

  /**
   * 獲取特定專案的工程實例列表
   * @param projectId 專案ID
   * @returns 屬於指定專案的工程實例列表
   */
  async listByProject(projectId: string): Promise<EngineeringInstance[]> {
    const engineerings = await prisma.engineeringInstance.findMany({
      where: { projectId }
    });
    return engineerings.map(engineeringInstanceAdapter.toDomain);
  }
}

/**
 * 工程實例儲存庫實例
 * 用於應用層和領域服務的注入
 */
export const engineeringInstanceRepository = new EngineeringInstanceRepository();