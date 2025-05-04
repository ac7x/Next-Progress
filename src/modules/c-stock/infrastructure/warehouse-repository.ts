import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { IWarehouseRepository } from '@/modules/c-stock/domain/warehouse-repository';

export class WarehouseInstanceRepository implements IWarehouseRepository {
  async create(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return prisma.warehouseInstance.create({ data });
  }

  async list(): Promise<WarehouseInstance[]> {
    return prisma.warehouseInstance.findMany();
  }

  async getById(id: string): Promise<WarehouseInstance | null> {
    return prisma.warehouseInstance.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return prisma.warehouseInstance.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.warehouseInstance.delete({ where: { id } });
  }
}

export const warehouseInstanceRepository = new WarehouseInstanceRepository();
