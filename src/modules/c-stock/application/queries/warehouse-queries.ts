'use server';

import { warehouseService } from '@/modules/c-stock/application/services';
import { Warehouse } from '@/modules/c-stock/domain/entities/warehouse-entity';

/**
 * 獲取所有倉庫
 * @param options 分頁和排序選項
 * @returns 倉庫列表
 */
export async function getAllWarehouses(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' }
}): Promise<Warehouse[]> {
    return warehouseService.getAllWarehouses(options);
}

/**
 * 根據ID查找倉庫
 * @param id 倉庫ID
 * @returns 倉庫資訊或null
 */
export async function getWarehouseById(id: string): Promise<Warehouse | null> {
    return warehouseService.getWarehouseById(id);
}

/**
 * 獲取倉庫總數
 * @param onlyActive 是否僅計算活動倉庫
 * @returns 倉庫總數
 */
export async function getWarehouseCount(onlyActive?: boolean): Promise<number> {
    return warehouseService.getWarehouseCount(onlyActive);
}