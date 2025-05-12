import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseItemProps, CreateWarehouseProps, UpdateWarehouseItemProps, UpdateWarehouseProps, Warehouse, WarehouseItem } from '@/modules/c-stock/domain/entities';
import { IWarehouseItemRepository, IWarehouseRepository } from '@/modules/c-stock/domain/repositories';
import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import { WarehouseItemType } from '@prisma/client';
import { warehouseAdapter, warehouseItemAdapter } from '../adapter';
import { transactionManager } from '../persistence';

/**
 * 倉庫儲存庫 - 實現倉庫實體在Prisma/MongoDB的持久化操作
 */
export class WarehouseInstanceRepository implements IWarehouseRepository {
    /**
     * 根據ID查找倉庫
     * @param id 倉庫ID
     */
    async findById(id: string): Promise<Warehouse | null> {
        const warehouse = await prisma.warehouseInstance.findUnique({
            where: { id }
        });

        if (!warehouse) return null;

        return warehouseAdapter.toDomain(warehouse);
    }

    /**
     * 查詢所有倉庫
     * @param options 分頁和排序選項
     */
    async findAll(options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' }
    }): Promise<Warehouse[]> {
        const warehouses = await prisma.warehouseInstance.findMany({
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy
        });

        return Promise.all(warehouses.map(warehouse => warehouseAdapter.toDomain(warehouse)));
    }

    /**
     * 根據名稱查詢倉庫
     * @param name 倉庫名稱
     */
    async findByName(name: string): Promise<Warehouse | null> {
        const warehouse = await prisma.warehouseInstance.findFirst({
            where: { name }
        });

        if (!warehouse) return null;

        return warehouseAdapter.toDomain(warehouse);
    }

    /**
     * 創建新倉庫
     * @param data 倉庫創建資料
     */
    async create(data: CreateWarehouseProps): Promise<Warehouse> {
        const warehouse = await prisma.warehouseInstance.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                location: data.location ?? null,
                isActive: data.isActive ?? true
            }
        });

        return warehouse;
    }

    /**
     * 更新倉庫資訊
     * @param id 倉庫ID
     * @param data 更新資料
     */
    async update(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
        const warehouse = await prisma.warehouseInstance.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.location !== undefined && { location: data.location }),
                ...(data.isActive !== undefined && { isActive: data.isActive })
            }
        });

        return warehouse;
    }

    /**
     * 刪除倉庫
     * @param id 倉庫ID
     */
    async delete(id: string): Promise<boolean> {
        try {
            // 使用事務確保刪除操作的一致性
            return await transactionManager.runInTransaction(async (tx) => {
                // 先刪除所有關聯的標籤關係
                await tx.tagRelation.deleteMany({
                    where: {
                        targetId: id,
                        targetType: 'WAREHOUSE_INSTANCE'
                    }
                });

                // 刪除倉庫
                await tx.warehouseInstance.delete({
                    where: { id }
                });

                return true;
            });
        } catch (error) {
            console.error('刪除倉庫失敗:', error);
            return false;
        }
    }

    /**
     * 獲取倉庫總數
     */
    async count(filter?: { isActive?: boolean }): Promise<number> {
        const count = await prisma.warehouseInstance.count({
            where: filter
        });

        return count;
    }
}

/**
 * 倉庫物品儲存庫 - 實現倉庫物品實體在Prisma/MongoDB的持久化操作
 */
export class WarehouseItemRepository implements IWarehouseItemRepository {
    async findById(id: string): Promise<WarehouseItem | null> {
        const warehouseItem = await prisma.warehouseItem.findUnique({
            where: { id },
            include: {
                warehouse: true
            }
        });

        if (!warehouseItem) return null;

        return warehouseItemAdapter.toDomain(warehouseItem);
    }

    async findAll(options?: {
        warehouseId?: string;
        type?: string;
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    }): Promise<WarehouseItem[]> {
        const warehouseItems = await prisma.warehouseItem.findMany({
            where: {
                ...(options?.warehouseId && { warehouseId: options.warehouseId }),
                ...(options?.type && { type: options.type as WarehouseItemType }),
            },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
            include: {
                warehouse: true
            }
        });

        return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
    }

    async findByWarehouseId(warehouseId: string, options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    }): Promise<WarehouseItem[]> {
        const warehouseItems = await prisma.warehouseItem.findMany({
            where: { warehouseId },
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
            include: {
                warehouse: true
            }
        });

        return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
    }

    async create(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
        const warehouseItem = await prisma.warehouseItem.create({
            data: {
                name: data.name,
                description: data.description,
                quantity: data.quantity,
                ...(data.unit !== undefined && { unit: data.unit }),
                type: data.type as WarehouseItemType, // 顯式轉換為 Prisma enum
                warehouse: {
                    connect: { id: data.warehouseId }
                }
            }
        });

        if (data.tags && data.tags.length > 0) {
            await prisma.tagRelation.createMany({
                data: data.tags.map(tagId => ({
                    tagId,
                    targetId: warehouseItem.id,
                    targetType: TagRelationType.WAREHOUSE_ITEM
                }))
            });
        }

        return this.findById(warehouseItem.id) as Promise<WarehouseItem>;
    }

    async createMany(dataList: CreateWarehouseItemProps[]): Promise<number> {
        const results = await Promise.all(dataList.map(data => this.create(data)));
        return results.length;
    }

    async update(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.quantity !== undefined) updateData.quantity = data.quantity;
        if (data.unit !== undefined) updateData.unit = data.unit;
        if (data.type !== undefined) updateData.type = data.type as WarehouseItemType;

        // 使用 Prisma 標準方式處理關聯更新
        if (data.warehouseId !== undefined) {
            updateData.warehouse = { connect: { id: data.warehouseId } };
        }

        const warehouseItem = await prisma.warehouseItem.update({
            where: { id },
            data: updateData
        });

        if (data.tags) {
            await prisma.tagRelation.deleteMany({
                where: { targetId: id, targetType: TagRelationType.WAREHOUSE_ITEM }
            });

            if (data.tags.length > 0) {
                await prisma.tagRelation.createMany({
                    data: data.tags.map(tagId => ({
                        tagId,
                        targetId: id,
                        targetType: TagRelationType.WAREHOUSE_ITEM
                    }))
                });
            }
        }

        return this.findById(id) as Promise<WarehouseItem>;
    }

    async updateQuantity(id: string, quantity: number): Promise<WarehouseItem> {
        await prisma.warehouseItem.update({
            where: { id },
            data: { quantity }
        });
        return this.findById(id) as Promise<WarehouseItem>;
    }

    async delete(id: string): Promise<boolean> {
        try {
            // 使用事務確保刪除操作的一致性
            return await transactionManager.runInTransaction(async (tx) => {
                // 刪除相關的標籤關係
                await tx.tagRelation.deleteMany({
                    where: {
                        targetId: id,
                        targetType: TagRelationType.WAREHOUSE_ITEM
                    }
                });

                // 刪除倉庫物品
                await tx.warehouseItem.delete({
                    where: { id }
                });

                return true;
            });
        } catch (error) {
            console.error('Error deleting warehouse item:', error);
            return false;
        }
    }

    async deleteByWarehouseId(warehouseId: string): Promise<number> {
        try {
            // 使用事務確保批量刪除的一致性
            return await transactionManager.runInTransaction(async (tx) => {
                // 獲取需要刪除的所有物品ID
                const items = await tx.warehouseItem.findMany({
                    where: { warehouseId },
                    select: { id: true }
                });

                // 批量刪除標籤關係
                if (items.length > 0) {
                    const itemIds = items.map(item => item.id);
                    await tx.tagRelation.deleteMany({
                        where: {
                            targetId: { in: itemIds },
                            targetType: TagRelationType.WAREHOUSE_ITEM
                        }
                    });
                }

                // 批量刪除倉庫物品
                await tx.warehouseItem.deleteMany({
                    where: { warehouseId }
                });

                return items.length;
            });
        } catch (error) {
            console.error('Error deleting items by warehouse ID:', error);
            return 0;
        }
    }

    async count(filter?: { warehouseId?: string; type?: string }): Promise<number> {
        return prisma.warehouseItem.count({
            where: {
                ...(filter?.warehouseId && { warehouseId: filter.warehouseId }),
                ...(filter?.type && { type: filter.type as WarehouseItemType })
            }
        });
    }

    /**
     * 添加標籤到倉庫物品
     * @param itemId 物品ID
     * @param tagId 標籤ID
     */
    async addTag(itemId: string, tagId: string): Promise<boolean> {
        try {
            await prisma.tagRelation.create({
                data: {
                    tagId,
                    targetId: itemId,
                    targetType: TagRelationType.WAREHOUSE_ITEM,
                    priority: 0
                }
            });
            return true;
        } catch (error) {
            console.error('Error adding tag to warehouse item:', error);
            return false;
        }
    }

    /**
     * 從倉庫物品移除標籤
     * @param itemId 物品ID
     * @param tagId 標籤ID
     */
    async removeTag(itemId: string, tagId: string): Promise<boolean> {
        try {
            await prisma.tagRelation.deleteMany({
                where: {
                    tagId,
                    targetId: itemId,
                    targetType: TagRelationType.WAREHOUSE_ITEM
                }
            });
            return true;
        } catch (error) {
            console.error('Error removing tag from warehouse item:', error);
            return false;
        }
    }

    async search(query: string, options?: {
        warehouseId?: string;
        skip?: number;
        take?: number;
    }): Promise<WarehouseItem[]> {
        const warehouseItems = await prisma.warehouseItem.findMany({
            where: {
                ...(options?.warehouseId && { warehouseId: options.warehouseId }),
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            },
            skip: options?.skip,
            take: options?.take,
            include: {
                warehouse: true
            }
        });

        return Promise.all(warehouseItems.map(warehouseItemAdapter.toDomain));
    }
}

// 導出的單例實例
export const warehouseItemRepository = new WarehouseItemRepository();
export const warehouseRepository = new WarehouseInstanceRepository();