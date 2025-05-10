import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { IWarehouseItemRepository } from '@/modules/c-stock/domain/warehouse-item-repository';
import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import { warehouseItemAdapter } from '../adapter/warehouse-item-adapter';

export class WarehouseItemRepository implements IWarehouseItemRepository {
  async create(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
    const warehouseItem = await prisma.warehouseItem.create({
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        ...(data.unit !== undefined && { unit: data.unit }),
        type: data.type, // Prisma enum 型別
        warehouse: {
          connect: { id: data.warehouseId }
        }
      }
    });

    if (data.tags && data.tags.length > 0) {
      await prisma.tagRelation.createMany({
        data: data.tags.map(tagId => ({
          tagId,
          targetId: warehouseItem.id,
          targetType: TagRelationType.WAREHOUSE_ITEM
        }))
      });
    }

    return warehouseItemAdapter.toDomain(warehouseItem);
  }

  async list(): Promise<WarehouseItem[]> {
    const warehouseItems = await prisma.warehouseItem.findMany({
      include: {
        warehouse: true
      }
    });
    return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
  }

  async listByWarehouse(warehouseId: string): Promise<WarehouseItem[]> {
    const warehouseItems = await prisma.warehouseItem.findMany({
      where: { warehouseId },
      include: { warehouse: true }
    });
    return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
  }

  async getById(id: string): Promise<WarehouseItem | null> {
    const warehouseItem = await prisma.warehouseItem.findUnique({
      where: { id }
    });
    return warehouseItem ? warehouseItemAdapter.toDomain(warehouseItem) : null;
  }

  async update(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
    const warehouseItem = await prisma.warehouseItem.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        ...(data.unit !== undefined && { unit: data.unit })
      }
    });

    if (data.tags) {
      await prisma.tagRelation.deleteMany({
        where: { targetId: id, targetType: TagRelationType.WAREHOUSE_ITEM }
      });

      if (data.tags.length > 0) {
        await prisma.tagRelation.createMany({
          data: data.tags.map(tagId => ({
            tagId,
            targetId: id,
            targetType: TagRelationType.WAREHOUSE_ITEM
          }))
        });
      }
    }

    return warehouseItemAdapter.toDomain(warehouseItem);
  }

  async delete(id: string): Promise<void> {
    await prisma.tagRelation.deleteMany({
      where: { targetId: id, targetType: TagRelationType.WAREHOUSE_ITEM }
    });
    await prisma.warehouseItem.delete({
      where: { id }
    });
  }
}

export const warehouseItemRepository = new WarehouseItemRepository();
