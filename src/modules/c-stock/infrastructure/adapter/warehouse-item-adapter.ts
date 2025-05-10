import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';

export const warehouseItemAdapter = {
  async toDomain(prismaWarehouseItem: any): Promise<WarehouseItem> {
    const tagRelations = await prisma.tagRelation.findMany({
      where: { targetId: prismaWarehouseItem.id, targetType: TagRelationType.WAREHOUSE_ITEM },
      include: { tag: true }
    });

    return {
      id: prismaWarehouseItem.id,
      name: prismaWarehouseItem.name,
      description: prismaWarehouseItem.description,
      quantity: prismaWarehouseItem.quantity,
      unit: prismaWarehouseItem.unit,
      type: prismaWarehouseItem.type, // Prisma enum 型別
      warehouseId: prismaWarehouseItem.warehouseId,
      tags: tagRelations.map(relation => ({
        id: relation.tagId,
        name: relation.tag?.name || '未知標籤',
        type: relation.tag?.type as TagRelationType
      })),
      createdAt: prismaWarehouseItem.createdAt,
      updatedAt: prismaWarehouseItem.updatedAt
    };
  }
};
