import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseItemProps, IWarehouseItemRepository, UpdateWarehouseItemProps, WarehouseItem } from '@/modules/c-stock/domain';
import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import { WarehouseItemType } from '@prisma/client';
import { warehouseItemAdapter } from '../adapter/warehouse-item-adapter';

export class WarehouseItemRepository implements IWarehouseItemRepository {
  async findById(id: string): Promise<WarehouseItem | null> {
    const warehouseItem = await prisma.warehouseItem.findUnique({
      where: { id },
      include: {
        warehouse: true
      }
    });

    if (!warehouseItem) return null;

    return warehouseItemAdapter.toDomain(warehouseItem);
  }

  async findAll(options?: {
    warehouseId?: string;
    type?: string;
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
  }): Promise<WarehouseItem[]> {
    const warehouseItems = await prisma.warehouseItem.findMany({
      where: {
        ...(options?.warehouseId && { warehouseId: options.warehouseId }),
        ...(options?.type && { type: options.type as WarehouseItemType }),
      },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: {
        warehouse: true
      }
    });

    return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
  }

  async findByWarehouseId(warehouseId: string, options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
  }): Promise<WarehouseItem[]> {
    const warehouseItems = await prisma.warehouseItem.findMany({
      where: { warehouseId },
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: {
        warehouse: true
      }
    });

    return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
  }

  async create(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
    const warehouseItem = await prisma.warehouseItem.create({
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        ...(data.unit !== undefined && { unit: data.unit }),
        type: data.type as WarehouseItemType, // 顯式轉換為 Prisma enum
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

    return this.findById(warehouseItem.id) as Promise<WarehouseItem>;
  }

  async createMany(dataList: CreateWarehouseItemProps[]): Promise<number> {
    const results = await Promise.all(dataList.map(data => this.create(data)));
    return results.length;
  }

  async update(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.type !== undefined) updateData.type = data.type as WarehouseItemType;

    // 使用 Prisma 標準方式處理關聯更新
    if (data.warehouseId !== undefined) {
      updateData.warehouse = { connect: { id: data.warehouseId } };
    }

    const warehouseItem = await prisma.warehouseItem.update({
      where: { id },
      data: updateData
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

    return this.findById(id) as Promise<WarehouseItem>;
  }

  async updateQuantity(id: string, quantity: number): Promise<WarehouseItem> {
    await prisma.warehouseItem.update({
      where: { id },
      data: { quantity }
    });
    return this.findById(id) as Promise<WarehouseItem>;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.tagRelation.deleteMany({
        where: { targetId: id, targetType: TagRelationType.WAREHOUSE_ITEM }
      });
      await prisma.warehouseItem.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting warehouse item:', error);
      return false;
    }
  }

  async deleteByWarehouseId(warehouseId: string): Promise<number> {
    const items = await prisma.warehouseItem.findMany({
      where: { warehouseId },
      select: { id: true }
    });

    for (const item of items) {
      await this.delete(item.id);
    }

    return items.length;
  }

  async count(filter?: { warehouseId?: string; type?: string }): Promise<number> {
    return prisma.warehouseItem.count({
      where: {
        ...(filter?.warehouseId && { warehouseId: filter.warehouseId }),
        ...(filter?.type && { type: filter.type as WarehouseItemType })
      }
    });
  }

  async search(query: string, options?: {
    warehouseId?: string;
    skip?: number;
    take?: number;
  }): Promise<WarehouseItem[]> {
    const warehouseItems = await prisma.warehouseItem.findMany({
      where: {
        ...(options?.warehouseId && { warehouseId: options.warehouseId }),
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      skip: options?.skip,
      take: options?.take,
      include: {
        warehouse: true
      }
    });

    return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
  }
}

export const warehouseItemRepository = new WarehouseItemRepository();
