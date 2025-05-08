'use server';

import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { revalidatePath } from 'next/cache';
import { warehouseInstanceService } from './warehouse-service';

// Command Only (CQRS: 只寫入)
export async function createWarehouseInstance(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
  const warehouse = await warehouseInstanceService.createWarehouseInstance(data);
  revalidatePath('/client/warehouse_instance');
  return warehouse;
}

export async function updateWarehouseInstance(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
  const warehouse = await warehouseInstanceService.updateWarehouseInstance(id, data);
  revalidatePath('/client/warehouse_instance');
  return warehouse;
}

export async function deleteWarehouseInstance(id: string): Promise<void> {
  await warehouseInstanceService.deleteWarehouseInstance(id);
  revalidatePath('/client/warehouse_instance');
}
