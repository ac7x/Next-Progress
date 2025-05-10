import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import {
  CreateWarehouseInstanceProps,
  IWarehouseRepository,
  UpdateWarehouseInstanceProps,
  WarehouseInstance
} from '@/modules/c-stock/domain';

export class WarehouseInstanceRepository implements IWarehouseRepository {
  async findById(id: string): Promise<WarehouseInstance | null> {
    return prisma.warehouseInstance.findUnique({ where: { id } });
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' }
  }): Promise<WarehouseInstance[]> {
    return prisma.warehouseInstance.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });
  }

  async findByName(name: string): Promise<WarehouseInstance | null> {
    return prisma.warehouseInstance.findFirst({ where: { name } });
  }

  async create(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return prisma.warehouseInstance.create({ data });
  }

  async update(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return prisma.warehouseInstance.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.warehouseInstance.delete({ where: { id } });
    return true;
  }

  async count(filter?: { isActive?: boolean }): Promise<number> {
    return prisma.warehouseInstance.count({
      where: filter,
    });
  }
}

export const warehouseInstanceRepository = new WarehouseInstanceRepository();
