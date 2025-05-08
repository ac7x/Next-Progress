'use server';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseItemProps, UpdateWarehouseItemProps } from '@/modules/c-stock/domain/warehouse-item-entity';
import { TagRelationType } from '@/modules/c-tag/domain/tag-entity';
import { warehouseItemService } from './warehouse-item-service';

// Command Only (CQRS: 只寫入)
export async function createWarehouseItem(data: CreateWarehouseItemProps) {
    return warehouseItemService.createWarehouseItem(data);
}

export async function updateWarehouseItem(id: string, data: UpdateWarehouseItemProps) {
    return warehouseItemService.updateWarehouseItem(id, data);
}

export async function deleteWarehouseItem(id: string) {
    return warehouseItemService.deleteWarehouseItem(id);
}

export async function addTagToWarehouseItem(itemId: string, tagId: string) {
    await prisma.tagRelation.create({
        data: { tagId, targetId: itemId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
}

export async function removeTagFromWarehouseItem(itemId: string, tagId: string) {
    await prisma.tagRelation.deleteMany({
        where: { targetId: itemId, tagId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
}
