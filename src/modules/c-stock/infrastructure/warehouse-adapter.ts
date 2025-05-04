import { Warehouse } from '@/modules/c-stock/domain/warehouse-entity';
import { Prisma, Warehouse as PrismaWarehouse } from '@prisma/client';

export const warehouseAdapter = {
  toDomain(prismaWarehouse: PrismaWarehouse): Warehouse {
    return {
      id: prismaWarehouse.id,
      name: prismaWarehouse.name,
      description: prismaWarehouse.description,
      location: prismaWarehouse.location,
      isActive: prismaWarehouse.isActive,
      createdAt: prismaWarehouse.createdAt,
      updatedAt: prismaWarehouse.updatedAt
    };
  },

  toPersistence(data: Partial<Warehouse>): Prisma.WarehouseUpdateInput {
    const result: Prisma.WarehouseUpdateInput = {};

    if (data.name !== undefined) result.name = data.name;
    if (data.description !== undefined) result.description = data.description;
    if (data.location !== undefined) result.location = data.location;
    if (data.isActive !== undefined) result.isActive = data.isActive;

    return result;
  }
};
