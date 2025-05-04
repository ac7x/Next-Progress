'use server';

import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { revalidatePath } from 'next/cache';
import * as warehouseItemCommand from './warehouseItem.command';
import * as warehouseItemQuery from './warehouseItem.query';

// -- Queries --
export async function getAllWarehouseItems(): Promise<WarehouseItem[]> {
  return warehouseItemQuery.getAllWarehouseItems();
}

export async function getWarehouseItemsByWarehouse(warehouseId: string): Promise<WarehouseItem[]> {
  return warehouseItemQuery.getWarehouseItemsByWarehouse(warehouseId);
}

export async function getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
  return warehouseItemQuery.getWarehouseItemById(id);
}

// -- Commands --
export async function createWarehouseItem(props: CreateWarehouseItemProps): Promise<WarehouseItem> {
  const item = await warehouseItemCommand.createWarehouseItem(props);
  revalidatePath('/client/warehouse_instance');
  return item;
}

export async function updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
  const item = await warehouseItemCommand.updateWarehouseItem(id, data);
  revalidatePath('/client/warehouse_instance');
  return item;
}

export async function deleteWarehouseItem(id: string): Promise<void> {
  await warehouseItemCommand.deleteWarehouseItem(id);
  revalidatePath('/client/warehouse_instance');
}

export async function addTagToWarehouseItem(itemId: string, tagId: string): Promise<void> {
  await warehouseItemCommand.addTagToWarehouseItem(itemId, tagId);
  revalidatePath('/client/warehouse_instance');
}

export async function deleteTagFromWarehouseItem(itemId: string, tagId: string): Promise<void> {
  await warehouseItemCommand.removeTagFromWarehouseItem(itemId, tagId);
  revalidatePath('/client/warehouse_instance');
}
