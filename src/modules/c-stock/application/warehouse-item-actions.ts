'use server';

import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { revalidatePath } from 'next/cache';
import {
  commandAddTagToItem,
  commandCreateWarehouseItem,
  commandDeleteWarehouseItem,
  commandRemoveTagFromItem,
  commandUpdateWarehouseItem,
} from './warehouse-item-command';
import {
  queryAllWarehouseItems,
  queryWarehouseItemById,
  queryWarehouseItemsByWarehouse,
} from './warehouse-item-query';

// -- Queries --
export async function getAllWarehouseItems(): Promise<WarehouseItem[]> {
  return queryAllWarehouseItems();
}

export async function getWarehouseItemsByWarehouse(warehouseId: string): Promise<WarehouseItem[]> {
  return queryWarehouseItemsByWarehouse(warehouseId);
}

export async function getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
  return queryWarehouseItemById(id);
}

// -- Commands --
export async function createWarehouseItem(props: CreateWarehouseItemProps): Promise<WarehouseItem> {
  const item = await commandCreateWarehouseItem(props);
  revalidatePath('/client/warehouse_instance');
  return item;
}

export async function updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
  const item = await commandUpdateWarehouseItem(id, data);
  revalidatePath('/client/warehouse_instance');
  return item;
}

export async function deleteWarehouseItem(id: string): Promise<void> {
  await commandDeleteWarehouseItem(id);
  revalidatePath('/client/warehouse_instance');
}

export async function addTagToWarehouseItem(itemId: string, tagId: string): Promise<void> {
  await commandAddTagToItem(itemId, tagId);
  revalidatePath('/client/warehouse_instance');
}

export async function deleteTagFromWarehouseItem(itemId: string, tagId: string): Promise<void> {
  await commandRemoveTagFromItem(itemId, tagId);
  revalidatePath('/client/warehouse_instance');
}
