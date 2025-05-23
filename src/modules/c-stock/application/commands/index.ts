'use server';

import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import { revalidatePath } from 'next/cache';
import { CreateWarehouseProps, UpdateWarehouseProps } from '../../domain/entities';
import { CreateWarehouseItemProps, UpdateWarehouseItemProps } from '../../domain/entities';
import { warehouseItemService, warehouseService } from '../services';

// 倉庫相關命令

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

// 倉庫物品相關命令

/**
 * 創建新倉庫物品
 * @param data 倉庫物品創建資料
 */
export async function createWarehouseItem(data: CreateWarehouseItemProps) {
    const item = await warehouseItemService.createWarehouseItem(data);
    revalidatePath('/client/warehouse_instance');
    return item;
}

/**
 * 批量創建倉庫物品
 * @param items 倉庫物品創建資料列表
 * @param warehouseId 倉庫ID
 */
export async function createManyWarehouseItems(
    items: Omit<CreateWarehouseItemProps, 'warehouseId'>[],
    warehouseId: string
) {
    const count = await warehouseItemService.createManyWarehouseItems(items, warehouseId);
    revalidatePath('/client/warehouse_instance');
    return count;
}

/**
 * 更新倉庫物品資訊
 * @param id 物品ID
 * @param data 更新資料
 */
export async function updateWarehouseItem(id: string, data: UpdateWarehouseItemProps) {
    const item = await warehouseItemService.updateWarehouseItem(id, data);
    revalidatePath('/client/warehouse_instance');
    return item;
}

/**
 * 更新物品數量
 * @param id 物品ID
 * @param quantity 新數量
 */
export async function updateWarehouseItemQuantity(id: string, quantity: number) {
    const item = await warehouseItemService.updateWarehouseItemQuantity(id, quantity);
    revalidatePath('/client/warehouse_instance');
    return item;
}

/**
 * 刪除倉庫物品
 * @param id 物品ID
 */
export async function deleteWarehouseItem(id: string) {
    const result = await warehouseItemService.deleteWarehouseItem(id);
    revalidatePath('/client/warehouse_instance');
    return result;
}

/**
 * 刪除倉庫的所有物品
 * @param warehouseId 倉庫ID
 */
export async function deleteItemsByWarehouseId(warehouseId: string) {
    const count = await warehouseItemService.deleteItemsByWarehouseId(warehouseId);
    revalidatePath('/client/warehouse_instance');
    return count;
}

/**
 * 為倉庫物品添加標籤
 * @param itemId 物品ID
 * @param tagId 標籤ID
 */
export async function addTagToWarehouseItem(itemId: string, tagId: string) {
    await prisma.tagRelation.create({
        data: { tagId, targetId: itemId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
    revalidatePath('/client/warehouse_instance');
}

/**
 * 從倉庫物品移除標籤
 * @param itemId 物品ID
 * @param tagId 標籤ID
 */
export async function removeTagFromWarehouseItem(itemId: string, tagId: string) {
    await prisma.tagRelation.deleteMany({
        where: { targetId: itemId, tagId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
    revalidatePath('/client/warehouse_instance');
}