import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '@/modules/c-stock/domain/warehouse-entity';
import { IWarehouseRepository } from '@/modules/c-stock/domain/warehouse-repository';
import { warehouseAdapter } from './warehouse-adapter';

export class WarehouseRepository implements IWarehouseRepository {
  async create(data: CreateWarehouseProps): Promise<Warehouse> {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: data.name,
        description: data.description,
        ...(data.location !== undefined && { location: data.location }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    });

    return warehouseAdapter.toDomain(warehouse);
  }

  async list(): Promise<Warehouse[]> {
    const warehouses = await prisma.warehouse.findMany();
    return warehouses.map(warehouseAdapter.toDomain);
  }

  async getById(id: string): Promise<Warehouse | null> {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id }
    });
    return warehouse ? warehouseAdapter.toDomain(warehouse) : null;
  }

  async update(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: warehouseAdapter.toPersistence(data)
    });
    return warehouseAdapter.toDomain(warehouse);
  }

  async delete(id: string): Promise<void> {
    await prisma.warehouse.delete({
      where: { id }
    });
  }
}

export const warehouseRepository = new WarehouseRepository();
