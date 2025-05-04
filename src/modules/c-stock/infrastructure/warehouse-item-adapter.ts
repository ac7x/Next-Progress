import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';

export const warehouseItemAdapter = {
  async toDomain(prismaWarehouseItem: any): Promise<WarehouseItem> {
    const tagRelations = await prisma.tagRelation.findMany({
      where: { targetId: prismaWarehouseItem.id, targetType: 'ITEM' },
      include: { tag: true }
    });

    return {
      id: prismaWarehouseItem.id,
      name: prismaWarehouseItem.name,
      description: prismaWarehouseItem.description,
      quantity: prismaWarehouseItem.quantity,
      unit: prismaWarehouseItem.unit,
      type: prismaWarehouseItem.type,
      warehouseId: prismaWarehouseItem.warehouseId,
      tags: tagRelations.map(relation => ({
        id: relation.tagId,
        name: relation.tag.name,
        type: relation.tag.type
      })),
      createdAt: prismaWarehouseItem.createdAt,
      updatedAt: prismaWarehouseItem.updatedAt
    };
  }
};
