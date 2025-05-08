'use server';
import { warehouseItemService } from './warehouse-item-service';

// Query Only (CQRS: 只查詢)
export async function getAllWarehouseItems() {
  return warehouseItemService.getAllWarehouseItems();
}

export async function getWarehouseItemsByWarehouse(warehouseId: string) {
  return warehouseItemService.getWarehouseItemsByWarehouse(warehouseId);
}

export async function getWarehouseItemById(id: string) {
  return warehouseItemService.getWarehouseItemById(id);
}
