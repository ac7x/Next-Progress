// filepath: /workspaces/Next-Progress/src/modules/c-stock/infrastructure/adapter/warehouse.adapter.ts

import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Warehouse, WarehouseItem } from '@/modules/c-stock/domain';
import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';

/* =========================
   Warehouse Adapter
========================= */

export const warehouseAdapter = {
    /**
     * 將 Prisma 倉庫模型轉換為領域倉庫實體
     * @param prismaWarehouse Prisma 倉庫模型
     * @returns 領域倉庫實體
     */
    async toDomain(prismaWarehouse: any): Promise<Warehouse> {
        const tagRelations = await prisma.tagRelation.findMany({
            where: { targetId: prismaWarehouse.id, targetType: TagRelationType.WAREHOUSE_INSTANCE },
            include: { tag: true }
        });

        return {
            id: prismaWarehouse.id,
            name: prismaWarehouse.name,
            description: prismaWarehouse.description,
            location: prismaWarehouse.location,
            isActive: prismaWarehouse.isActive,
            createdAt: prismaWarehouse.createdAt,
            updatedAt: prismaWarehouse.updatedAt,
            tags: tagRelations.map(relation => ({
                id: relation.tagId,
                name: relation.tag?.name || '未知標籤',
                type: relation.tag?.type as TagRelationType
            }))
        };
    }
};

/* =========================
   WarehouseItem Adapter
========================= */

export const warehouseItemAdapter = {
    /**
     * 將 Prisma 倉庫物品模型轉換為領域倉庫物品實體
     * @param prismaWarehouseItem Prisma 倉庫物品模型
     * @returns 領域倉庫物品實體
     */
    async toDomain(prismaWarehouseItem: any): Promise<WarehouseItem> {
        const tagRelations = await prisma.tagRelation.findMany({
            where: { targetId: prismaWarehouseItem.id, targetType: TagRelationType.WAREHOUSE_ITEM },
            include: { tag: true }
        });

        return {
            id: prismaWarehouseItem.id,
            name: prismaWarehouseItem.name,
            description: prismaWarehouseItem.description,
            quantity: prismaWarehouseItem.quantity,
            unit: prismaWarehouseItem.unit,
            type: prismaWarehouseItem.type,
            warehouseId: prismaWarehouseItem.warehouseId,
            tags: tagRelations.map(relation => ({
                id: relation.tagId,
                name: relation.tag?.name || '未知標籤',
                type: relation.tag?.type as TagRelationType
            })),
            createdAt: prismaWarehouseItem.createdAt,
            updatedAt: prismaWarehouseItem.updatedAt
        };
    }
};
