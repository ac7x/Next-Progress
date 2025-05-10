'use server';

import { revalidatePath } from 'next/cache';
import { CreateWarehouseProps, UpdateWarehouseProps } from '../../domain/entities/warehouse-entity';
import { warehouseService } from '../services/warehouse-service';

/**
 * 創建新倉庫
 * @param data 倉庫創建資料
 */
export async function createWarehouse(data: CreateWarehouseProps) {
    const warehouse = await warehouseService.createWarehouse(data);
    revalidatePath('/client/warehouse_instance');
    return warehouse;
}

/**
 * 更新倉庫資訊
 * @param id 倉庫ID
 * @param data 更新資料
 */
export async function updateWarehouse(id: string, data: UpdateWarehouseProps) {
    const warehouse = await warehouseService.updateWarehouse(id, data);
    revalidatePath('/client/warehouse_instance');
    return warehouse;
}

/**
 * 刪除倉庫
 * @param id 倉庫ID
 */
export async function deleteWarehouse(id: string) {
    const result = await warehouseService.deleteWarehouse(id);
    revalidatePath('/client/warehouse_instance');
    return result;
}

/**
 * 啟用倉庫
 * @param id 倉庫ID
 */
export async function activateWarehouse(id: string) {
    const warehouse = await warehouseService.activateWarehouse(id);
    revalidatePath('/client/warehouse_instance');
    return warehouse;
}

/**
 * 停用倉庫
 * @param id 倉庫ID
 */
export async function deactivateWarehouse(id: string) {
    const warehouse = await warehouseService.deactivateWarehouse(id);
    revalidatePath('/client/warehouse_instance');
    return warehouse;
}