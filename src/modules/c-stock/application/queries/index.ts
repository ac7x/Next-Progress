'use server';

import { warehouseService, warehouseItemService } from '@/modules/c-stock/application/services';
import { Warehouse, WarehouseItem } from '@/modules/c-stock/domain';

/* =========================
   Warehouse Actions
========================= */

/**
 * 獲取所有倉庫
 * @param options 分頁和排序選項
 * @returns 倉庫列表
 */
export async function getAllWarehouses(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
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

/* =========================
   WarehouseItem Actions
========================= */

/**
 * 獲取所有倉庫物品
 * @param options 查詢選項
 * @returns 倉庫物品列表
 */
export async function getAllWarehouseItems(options?: {
    warehouseId?: string;
    type?: string;
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
}): Promise<WarehouseItem[]> {
    return warehouseItemService.getAllWarehouseItems(options);
}

/**
 * 根據倉庫ID獲取物品
 * @param warehouseId 倉庫ID
 * @param options 查詢選項
 * @returns 倉庫物品列表
 */
export async function getItemsByWarehouseId(warehouseId: string, options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
}): Promise<WarehouseItem[]> {
    return warehouseItemService.getItemsByWarehouseId(warehouseId, options);
}

/**
 * 根據ID獲取倉庫物品
 * @param id 物品ID
 * @returns 倉庫物品或null
 */
export async function getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
    return warehouseItemService.getWarehouseItemById(id);
}

/**
 * 獲取物品總數
 * @param filter 過濾條件
 * @returns 物品總數
 */
export async function getWarehouseItemCount(filter?: { warehouseId?: string; type?: string }): Promise<number> {
    return warehouseItemService.getWarehouseItemCount(filter);
}

/**
 * 搜索倉庫物品
 * @param query 搜索關鍵詞
 * @param options 搜索選項
 * @returns 匹配的倉庫物品列表
 */
export async function searchWarehouseItems(query: string, options?: {
    warehouseId?: string;
    skip?: number;
    take?: number;
}): Promise<WarehouseItem[]> {
    return warehouseItemService.searchWarehouseItems(query, options);
}
