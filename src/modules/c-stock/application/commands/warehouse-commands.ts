'use server';

import { CreateWarehouseDTO, UpdateWarehouseDTO, WarehouseDTO } from '@/modules/c-stock/application/dto';
import { warehouseService } from '@/modules/c-stock/application/services';
import { Warehouse } from '@/modules/c-stock/domain/entities/warehouse-entity';

/**
 * 創建新倉庫
 * @param data 倉庫創建資料
 */
export async function createWarehouse(data: CreateWarehouseDTO): Promise<Warehouse> {
  return warehouseService.createWarehouse(data);
}

/**
 * 更新倉庫資訊
 * @param id 倉庫ID
 * @param data 更新資料
 */
export async function updateWarehouse(id: string, data: UpdateWarehouseDTO): Promise<Warehouse> {
  return warehouseService.updateWarehouse(id, data);
}

/**
 * 刪除倉庫
 * @param id 倉庫ID
 */
export async function deleteWarehouse(id: string): Promise<void> {
  return warehouseService.deleteWarehouse(id);
}

/**
 * 啟用倉庫
 * @param id 倉庫ID
 */
export async function activateWarehouse(id: string): Promise<Warehouse> {
  return warehouseService.activateWarehouse(id);
}

/**
 * 停用倉庫
 * @param id 倉庫ID
 */
export async function deactivateWarehouse(id: string): Promise<Warehouse> {
  return warehouseService.deactivateWarehouse(id);
}