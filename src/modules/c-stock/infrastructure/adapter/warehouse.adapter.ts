// filepath: /workspaces/Next-Progress/src/modules/c-stock/infrastructure/adapter/warehouse.adapter.ts
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Warehouse } from '@/modules/c-stock/domain';
import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';

export const warehouseAdapter = {
  /**
   * 將 Prisma 模型轉換為領域實體
   * @param prismaWarehouse Prisma 倉庫模型
   * @returns 領域倉庫實體
   */
  async toDomain(prismaWarehouse: any): Promise<Warehouse> {
    const tagRelations = await prisma.tagRelation.findMany({
      where: { targetId: prismaWarehouse.id, targetType: TagRelationType.WAREHOUSE_INSTANCE },
      include: { tag: true }
    });

    return {
      id: prismaWarehouse.id,
      name: prismaWarehouse.name,
      description: prismaWarehouse.description,
      location: prismaWarehouse.location,
      isActive: prismaWarehouse.isActive,
      createdAt: prismaWarehouse.createdAt,
      updatedAt: prismaWarehouse.updatedAt,
      tags: tagRelations.map(relation => ({
        id: relation.tagId,
        name: relation.tag?.name || '未知標籤',
        type: relation.tag?.type as TagRelationType
      }))
    };
  }
};
