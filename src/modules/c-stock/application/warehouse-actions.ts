'use server';

import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { revalidatePath } from 'next/cache';
import { warehouseInstanceService } from './warehouse-service';

export async function getAllWarehouseInstances(): Promise<WarehouseInstance[]> {
  return warehouseInstanceService.getAllWarehouseInstances();
}

export async function getWarehouseInstanceById(id: string): Promise<WarehouseInstance | null> {
  return warehouseInstanceService.getWarehouseInstanceById(id);
}

export async function createWarehouseInstance(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
  const warehouse = await warehouseInstanceService.createWarehouseInstance(data);
  revalidatePath('warehouse_instance');
  return warehouse;
}

export async function updateWarehouseInstance(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
  const warehouse = await warehouseInstanceService.updateWarehouseInstance(id, data);
  revalidatePath('warehouse_instance');
  return warehouse;
}

export async function deleteWarehouseInstance(id: string): Promise<void> {
  await warehouseInstanceService.deleteWarehouseInstance(id);
  revalidatePath('warehouse_instance');
}
