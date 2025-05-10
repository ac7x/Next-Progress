'use server';

import { warehouseService } from '@/modules/c-stock/application/services';
import { Warehouse } from '@/modules/c-stock/domain/entities/warehouse-entity';

/**
 * 獲取所有倉庫
 * @returns 倉庫列表
 */
export async function getAllWarehouses(): Promise<Warehouse[]> {
    return warehouseService.getAllWarehouses();
}

/**
 * 根據ID獲取倉庫
 * @param id 倉庫ID
 * @returns 倉庫資訊或null
 */
export async function getWarehouseById(id: string): Promise<Warehouse | null> {
    return warehouseService.getWarehouseById(id);
}