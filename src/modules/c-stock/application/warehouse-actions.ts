'use server';

import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { revalidatePath } from 'next/cache';
import { warehouseService } from './warehouse-service';

export async function getAllWarehouses(): Promise<WarehouseInstance[]> {
  return warehouseService.getAllWarehouses();
}

export async function getWarehouseById(id: string): Promise<WarehouseInstance | null> {
  return warehouseService.getWarehouseById(id);
}

export async function createWarehouse(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
  const warehouse = await warehouseService.createWarehouse(data);
  revalidatePath('/client/warehouse');
  return warehouse;
}

export async function updateWarehouse(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
  const warehouse = await warehouseService.updateWarehouse(id, data);
  revalidatePath('/client/warehouse');
  return warehouse;
}

export async function deleteWarehouse(id: string): Promise<void> {
  await warehouseService.deleteWarehouse(id);
  revalidatePath('/client/warehouse');
}
