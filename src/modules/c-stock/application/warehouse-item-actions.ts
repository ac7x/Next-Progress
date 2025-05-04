'use server';

import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { revalidatePath } from 'next/cache';
import { warehouseItemService } from './warehouse-item-service';

export async function getAllWarehouseItems(): Promise<WarehouseItem[]> {
  try {
    return await warehouseItemService.getAllWarehouseItems();
  } catch (error) {
    console.error('獲取所有倉庫物品失敗:', error);
    return [];
  }
}

export async function getWarehouseItemsByWarehouse(warehouseId: string): Promise<WarehouseItem[]> {
  try {
    return await warehouseItemService.getWarehouseItemsByWarehouse(warehouseId);
  } catch (error) {
    console.error('獲取特定倉庫的物品失敗:', error);
    return [];
  }
}

export async function getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
  try {
    return await warehouseItemService.getWarehouseItemById(id);
  } catch (error) {
    console.error('獲取倉庫物品詳情失敗:', error);
    return null;
  }
}

export async function getWarehouseItemTags(warehouseItemId: string): Promise<string[]> {
  return warehouseItemService.getWarehouseItemTags(warehouseItemId);
}

export async function createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
  try {
    const warehouseItem = await warehouseItemService.createWarehouseItem(data);
    revalidatePath('warehouse_instance');
    return warehouseItem;
  } catch (error) {
    console.error('建立倉庫物品失敗:', error);
    throw error instanceof Error ? error : new Error('建立倉庫物品失敗');
  }
}

export async function updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
  try {
    const warehouseItem = await warehouseItemService.updateWarehouseItem(id, data);
    revalidatePath('warehouse_instance');
    return warehouseItem;
  } catch (error) {
    console.error('更新倉庫物品失敗:', error);
    throw error instanceof Error ? error : new Error('更新倉庫物品失敗');
  }
}

export async function deleteWarehouseItem(id: string): Promise<boolean> {
  try {
    await warehouseItemService.deleteWarehouseItem(id);
    revalidatePath('warehouse_instance');
    return true;
  } catch (error) {
    console.error('刪除倉庫物品失敗:', error);
    throw error instanceof Error ? error : new Error('刪除倉庫物品失敗');
  }
}

export async function addTagToWarehouseItem(itemId: string, tagId: string): Promise<void> {
  await warehouseItemService.addTagToItem(itemId, tagId);
  revalidatePath('warehouse_instance');
}

export async function deleteTagFromWarehouseItem(itemId: string, tagId: string): Promise<void> {
  await warehouseItemService.removeTagFromItem(itemId, tagId);
  revalidatePath('warehouse_instance');
}
