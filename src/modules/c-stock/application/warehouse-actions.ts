'use server';

import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { revalidatePath } from 'next/cache';
import { warehouseInstanceService } from './warehouse-service';

// 此檔案將被拆分為 warehouse.command.ts 與 warehouse.query.ts
// 請參考下方新檔案內容

export async function getAllWarehouseInstances(): Promise<WarehouseInstance[]> {
  return warehouseInstanceService.getAllWarehouseInstances();
}

export async function getWarehouseInstanceById(id: string): Promise<WarehouseInstance | null> {
  return warehouseInstanceService.getWarehouseInstanceById(id);
}

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
