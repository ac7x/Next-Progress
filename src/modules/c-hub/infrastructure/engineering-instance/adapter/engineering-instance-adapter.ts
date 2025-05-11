/**
 * 工程實例適配器 - 負責在領域模型與持久化模型之間進行轉換
 * 確保領域邏輯與基礎設施實現的分離，保持領域模型的純淨性
 */

import { EngineeringInstance, EngineeringInstanceFactory, EngineeringInstanceRaw, UpdateEngineeringInstanceProps } from '@/modules/c-hub/domain/engineering-instance/entities/engineering-instance-entity';
import type { EngineeringInstance as PrismaEngineeringInstance } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const engineeringInstanceAdapter = {
  /**
   * 將Prisma模型轉換為領域實體
   * @param prismaInstance Prisma工程實例模型
   * @returns 工程實例領域實體
   */
  toDomain(prismaInstance: PrismaEngineeringInstance): EngineeringInstance {
    const raw: EngineeringInstanceRaw = {
      id: prismaInstance.id,
      name: prismaInstance.name,
      description: prismaInstance.description,
      projectId: prismaInstance.projectId,
      userId: prismaInstance.userId,
      createdAt: prismaInstance.createdAt,
      updatedAt: prismaInstance.updatedAt
    };

    return EngineeringInstanceFactory.create(raw);
  },

  /**
   * 將更新請求轉換為Prisma更新輸入
   * @param domainModel 領域實體更新資料
   * @returns Prisma更新輸入
   */
  toPersistence(domainModel: Partial<UpdateEngineeringInstanceProps>): Prisma.EngineeringInstanceUpdateInput {
    const data: Prisma.EngineeringInstanceUpdateInput = {};

    if (domainModel.name !== undefined) data.name = domainModel.name;
    if (domainModel.description !== undefined) data.description = domainModel.description;

    return data;
  }
};
