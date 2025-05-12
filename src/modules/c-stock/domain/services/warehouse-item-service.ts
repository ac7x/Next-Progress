import {
    CreateWarehouseItemProps,
    UpdateWarehouseItemProps,
    WarehouseItem
} from '../entities/warehouse-item-entity';
import { domainEventPublisher } from '../events/event-publisher';
import { WarehouseItemCreatedEvent } from '../events/warehouse-item-created-event';
import { WarehouseItemDeletedEvent } from '../events/warehouse-item-deleted-event';
import { WarehouseItemUpdatedEvent } from '../events/warehouse-item-updated-event';
import { IWarehouseItemRepository } from '../repositories/warehouse-item-repository-interface';
import { IWarehouseRepository } from '../repositories/warehouse-repository-interface';

/**
 * 倉庫物品領域服務 - 封裝與倉庫物品相關的業務邏輯
 */
export class WarehouseItemService {
    constructor(
        private readonly warehouseItemRepository: IWarehouseItemRepository,
        private readonly warehouseRepository: IWarehouseRepository
    ) { }

    /**
     * 創建新倉庫物品
     * @param data 倉庫物品創建資料
     */
    async createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
        // 檢查倉庫是否存在
        const warehouse = await this.warehouseRepository.findById(data.warehouseId);
        if (!warehouse) {
            throw new Error(`找不到 ID 為 ${data.warehouseId} 的倉庫`);
        }

        // 檢查倉庫是否處於活動狀態
        if (!warehouse.isActive) {
            throw new Error(`倉庫 "${warehouse.name}" 目前處於非活動狀態，無法新增物品`);
        }

        // 創建倉庫物品
        const item = await this.warehouseItemRepository.create(data);

        // 透過事件發布者觸發倉庫物品創建事件
        const event = new WarehouseItemCreatedEvent(item);
        domainEventPublisher.publish(event);

        return item;
    }

    /**
     * 批量創建倉庫物品
     * @param items 倉庫物品創建資料列表
     * @param warehouseId 倉庫ID
     */
    async createManyWarehouseItems(
        items: Omit<CreateWarehouseItemProps, 'warehouseId'>[],
        warehouseId: string
    ): Promise<number> {
        // 檢查倉庫是否存在
        const warehouse = await this.warehouseRepository.findById(warehouseId);
        if (!warehouse) {
            throw new Error(`找不到 ID 為 ${warehouseId} 的倉庫`);
        }

        // 檢查倉庫是否處於活動狀態
        if (!warehouse.isActive) {
            throw new Error(`倉庫 "${warehouse.name}" 目前處於非活動狀態，無法新增物品`);
        }

        // 添加倉庫ID到每個物品
        const itemsWithWarehouseId = items.map(item => ({
            ...item,
            warehouseId
        }));

        // 批量創建
        return this.warehouseItemRepository.createMany(itemsWithWarehouseId);
    }

    /**
     * 更新倉庫物品資訊
     * @param id 物品ID
     * @param data 更新資料
     */
    async updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
        // 檢查物品是否存在
        const item = await this.warehouseItemRepository.findById(id);
        if (!item) {
            throw new Error(`找不到 ID 為 ${id} 的倉庫物品`);
        }

        // 如果要變更倉庫，檢查目標倉庫是否存在且處於活動狀態
        if (data.warehouseId && data.warehouseId !== item.warehouseId) {
            const targetWarehouse = await this.warehouseRepository.findById(data.warehouseId);
            if (!targetWarehouse) {
                throw new Error(`找不到 ID 為 ${data.warehouseId} 的倉庫`);
            }

            if (!targetWarehouse.isActive) {
                throw new Error(`目標倉庫 "${targetWarehouse.name}" 處於非活動狀態，無法轉移物品`);
            }
        }

        // 保存舊值以便事件使用
        const previousValues = { ...item };

        // 更新物品
        const updatedItem = await this.warehouseItemRepository.update(id, data);

        // 觸發事件
        const event = new WarehouseItemUpdatedEvent(updatedItem, previousValues);
        console.log('倉庫物品更新事件已觸發:', event);

        return updatedItem;
    }

    /**
     * 更新物品數量
     * @param id 物品ID
     * @param quantity 新數量
     */
    async updateWarehouseItemQuantity(id: string, quantity: number): Promise<WarehouseItem> {
        // 檢查物品是否存在
        const item = await this.warehouseItemRepository.findById(id);
        if (!item) {
            throw new Error(`找不到 ID 為 ${id} 的倉庫物品`);
        }

        // 檢查數量是否有效
        if (quantity < 0) {
            throw new Error('物品數量不能為負數');
        }

        // 保存舊值以便事件使用
        const previousValues = { ...item };

        // 更新數量
        const updatedItem = await this.warehouseItemRepository.updateQuantity(id, quantity);

        // 觸發事件
        const event = new WarehouseItemUpdatedEvent(updatedItem, previousValues);
        console.log('倉庫物品數量更新事件已觸發:', event);

        return updatedItem;
    }

    /**
     * 刪除倉庫物品
     * @param id 物品ID
     */
    async deleteWarehouseItem(id: string): Promise<boolean> {
        // 檢查物品是否存在
        const item = await this.warehouseItemRepository.findById(id);
        if (!item) {
            throw new Error(`找不到 ID 為 ${id} 的倉庫物品`);
        }

        // 保存相關資訊以便觸發事件
        const warehouseId = item.warehouseId;

        // 刪除物品
        const result = await this.warehouseItemRepository.delete(id);

        // 觸發事件
        const event = new WarehouseItemDeletedEvent(id, warehouseId);
        console.log('倉庫物品刪除事件已觸發:', event);

        return result;
    }

    /**
     * 根據倉庫ID刪除所有物品
     * @param warehouseId 倉庫ID
     */
    async deleteItemsByWarehouseId(warehouseId: string): Promise<number> {
        // 檢查倉庫是否存在
        const warehouse = await this.warehouseRepository.findById(warehouseId);
        if (!warehouse) {
            throw new Error(`找不到 ID 為 ${warehouseId} 的倉庫`);
        }

        // 獲取所有物品以便觸發事件
        const items = await this.warehouseItemRepository.findByWarehouseId(warehouseId);

        // 批量刪除
        const deletedCount = await this.warehouseItemRepository.deleteByWarehouseId(warehouseId);

        // 為每個物品觸發刪除事件
        items.forEach(item => {
            const event = new WarehouseItemDeletedEvent(item.id, warehouseId);
            console.log('倉庫物品刪除事件已觸發:', event);
        });

        return deletedCount;
    }

    /**
     * 根據ID查找倉庫物品
     * @param id 物品ID
     */
    async getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
        return this.warehouseItemRepository.findById(id);
    }

    /**
     * 獲取所有倉庫物品，可選擇按倉庫或類型過濾
     * @param options 查詢選項
     */
    async getAllWarehouseItems(options?: {
        warehouseId?: string;
        type?: string;
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    }): Promise<WarehouseItem[]> {
        return this.warehouseItemRepository.findAll(options);
    }

    /**
     * 根據倉庫ID獲取物品
     * @param warehouseId 倉庫ID
     * @param options 查詢選項
     */
    async getItemsByWarehouseId(warehouseId: string, options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    }): Promise<WarehouseItem[]> {
        return this.warehouseItemRepository.findByWarehouseId(warehouseId, options);
    }

    /**
     * 獲取物品總數
     * @param filter 過濾條件
     */
    async getWarehouseItemCount(filter?: { warehouseId?: string; type?: string }): Promise<number> {
        return this.warehouseItemRepository.count(filter);
    }

    /**
     * 搜索倉庫物品
     * @param query 搜索關鍵詞
     * @param options 搜索選項
     */
    async searchWarehouseItems(query: string, options?: {
        warehouseId?: string;
        skip?: number;
        take?: number;
    }): Promise<WarehouseItem[]> {
        if (!query || query.trim() === '') {
            return [];
        }
        return this.warehouseItemRepository.search(query, options);
    }
}