'use server';

import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseItemDTO, UpdateWarehouseItemDTO } from '@/modules/c-stock/application/dto';
import { warehouseItemService } from '@/modules/c-stock/application/services';
import { WarehouseItem } from '@/modules/c-stock/domain/entities/warehouse-item-entity';
import { TagRelationType } from '@/modules/c-tag/domain/tag-entity';

/**
 * 創建新倉庫物品
 * @param data 倉庫物品創建資料
 */
export async function createWarehouseItem(data: CreateWarehouseItemDTO): Promise<WarehouseItem> {
    return warehouseItemService.createWarehouseItem(data);
}

/**
 * 批量創建倉庫物品
 * @param items 倉庫物品創建資料列表
 * @param warehouseId 倉庫ID
 */
export async function createManyWarehouseItems(
    items: Omit<CreateWarehouseItemDTO, 'warehouseId'>[],
    warehouseId: string
): Promise<number> {
    return warehouseItemService.createManyWarehouseItems(items, warehouseId);
}

/**
 * 更新倉庫物品資訊
 * @param id 物品ID
 * @param data 更新資料
 */
export async function updateWarehouseItem(
    id: string,
    data: UpdateWarehouseItemDTO
): Promise<WarehouseItem> {
    return warehouseItemService.updateWarehouseItem(id, data);
}

/**
 * 更新倉庫物品數量
 * @param id 物品ID
 * @param quantity 新數量
 */
export async function updateWarehouseItemQuantity(
    id: string,
    quantity: number
): Promise<WarehouseItem> {
    return warehouseItemService.updateWarehouseItemQuantity(id, quantity);
}

/**
 * 刪除倉庫物品
 * @param id 物品ID
 */
export async function deleteWarehouseItem(id: string): Promise<void> {
    return warehouseItemService.deleteWarehouseItem(id);
}

/**
 * 為倉庫物品添加標籤
 * @param itemId 物品ID
 * @param tagId 標籤ID
 */
export async function addTagToWarehouseItem(itemId: string, tagId: string): Promise<void> {
    await prisma.tagRelation.create({
        data: { tagId, targetId: itemId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
}

/**
 * 從倉庫物品移除標籤
 * @param itemId 物品ID
 * @param tagId 標籤ID
 */
export async function removeTagFromWarehouseItem(itemId: string, tagId: string): Promise<void> {
    await prisma.tagRelation.deleteMany({
        where: { targetId: itemId, tagId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
}