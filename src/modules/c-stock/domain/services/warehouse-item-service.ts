import {
    CreateWarehouseItemProps,
    UpdateWarehouseItemProps,
    WarehouseItem
} from '../entities/warehouse-item-entity';
import {
    WarehouseItemCreatedEvent,
    WarehouseItemDeletedEvent,
    WarehouseItemUpdatedEvent
} from '../events';
import { IWarehouseItemRepository } from '../repositories/warehouse-item-repository-interface';
import { IWarehouseRepository } from '../repositories/warehouse-repository-interface';

/**
 * 倉庫物品領域服務 - 實現物品相關的業務邏輯
 */
export class WarehouseItemService {
    constructor(
        private readonly warehouseItemRepository: IWarehouseItemRepository,
        private readonly warehouseRepository: IWarehouseRepository
    ) { }

    /**
     * 創建新倉庫物品
     * @param data 創建資料
     */
    async createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
        // 檢查倉庫是否存在
        const warehouse = await this.warehouseRepository.findById(data.warehouseId);
        if (!warehouse) {
            throw new Error(`倉庫 ID "${data.warehouseId}" 不存在`);
        }

        // 創建物品
        const item = await this.warehouseItemRepository.create(data);

        // 發布物品創建事件
        const event = new WarehouseItemCreatedEvent(item);
        // 事件發布邏輯將在基礎設施層實現

        return item;
    }

    /**
     * 批量創建倉庫物品
     * @param dataList 創建資料列表
     */
    async createWarehouseItems(dataList: CreateWarehouseItemProps[]): Promise<number> {
        // 檢查所有物品的倉庫ID是否存在
        const warehouseIds = [...new Set(dataList.map(data => data.warehouseId))];

        for (const warehouseId of warehouseIds) {
            const warehouse = await this.warehouseRepository.findById(warehouseId);
            if (!warehouse) {
                throw new Error(`倉庫 ID "${warehouseId}" 不存在`);
            }
        }

        // 批量創建物品
        const createdCount = await this.warehouseItemRepository.createMany(dataList);

        // 在實際應用中，我們可能還會發布批量創建事件

        return createdCount;
    }

    /**
     * 更新倉庫物品資訊
     * @param id 物品ID
     * @param data 更新資料
     */
    async updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
        // 檢查物品是否存在
        const existingItem = await this.warehouseItemRepository.findById(id);
        if (!existingItem) {
            throw new Error(`物品 ID "${id}" 不存在`);
        }

        // 如果要更新倉庫ID，檢查新倉庫是否存在
        if (data.warehouseId && data.warehouseId !== existingItem.warehouseId) {
            const warehouse = await this.warehouseRepository.findById(data.warehouseId);
            if (!warehouse) {
                throw new Error(`倉庫 ID "${data.warehouseId}" 不存在`);
            }
        }

        // 保存更新前的值用於事件
        const previousValues = { ...existingItem };

        // 更新物品
        const updatedItem = await this.warehouseItemRepository.update(id, data);

        // 發布物品更新事件
        const event = new WarehouseItemUpdatedEvent(updatedItem, previousValues);
        // 事件發布邏輯將在基礎設施層實現

        return updatedItem;
    }

    /**
     * 增加物品庫存
     * @param id 物品ID
     * @param quantity 增加數量
     */
    async increaseItemQuantity(id: string, quantity: number): Promise<WarehouseItem> {
        if (quantity <= 0) {
            throw new Error('增加的數量必須大於零');
        }

        const item = await this.warehouseItemRepository.findById(id);
        if (!item) {
            throw new Error(`物品 ID "${id}" 不存在`);
        }

        const newQuantity = item.quantity + quantity;
        return this.warehouseItemRepository.updateQuantity(id, newQuantity);
    }

    /**
     * 減少物品庫存
     * @param id 物品ID
     * @param quantity 減少數量
     */
    async decreaseItemQuantity(id: string, quantity: number): Promise<WarehouseItem> {
        if (quantity <= 0) {
            throw new Error('減少的數量必須大於零');
        }

        const item = await this.warehouseItemRepository.findById(id);
        if (!item) {
            throw new Error(`物品 ID "${id}" 不存在`);
        }

        if (item.quantity < quantity) {
            throw new Error(`物品 "${item.name}" 庫存不足，當前庫存: ${item.quantity}, 請求減少: ${quantity}`);
        }

        const newQuantity = item.quantity - quantity;
        return this.warehouseItemRepository.updateQuantity(id, newQuantity);
    }

    /**
     * 刪除倉庫物品
     * @param id 物品ID
     */
    async deleteWarehouseItem(id: string): Promise<boolean> {
        // 檢查物品是否存在
        const existingItem = await this.warehouseItemRepository.findById(id);
        if (!existingItem) {
            throw new Error(`物品 ID "${id}" 不存在`);
        }

        // 刪除物品
        const result = await this.warehouseItemRepository.delete(id);

        if (result) {
            // 發布物品刪除事件
            const event = new WarehouseItemDeletedEvent(id, existingItem.warehouseId);
            // 事件發布邏輯將在基礎設施層實現
        }

        return result;
    }

    /**
     * 獲取單個倉庫物品
     * @param id 物品ID
     */
    async getWarehouseItem(id: string): Promise<WarehouseItem | null> {
        return this.warehouseItemRepository.findById(id);
    }

    /**
     * 獲取倉庫中的所有物品
     * @param warehouseId 倉庫ID
     */
    async getItemsByWarehouse(warehouseId: string, options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    }): Promise<WarehouseItem[]> {
        return this.warehouseItemRepository.findByWarehouseId(warehouseId, options);
    }

    /**
     * 獲取所有倉庫物品
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
     * 搜索倉庫物品
     */
    async searchWarehouseItems(query: string, options?: {
        warehouseId?: string;
        skip?: number;
        take?: number;
    }): Promise<WarehouseItem[]> {
        return this.warehouseItemRepository.search(query, options);
    }

    /**
     * 獲取物品數量
     */
    async getWarehouseItemsCount(filter?: { warehouseId?: string; type?: string }): Promise<number> {
        return this.warehouseItemRepository.count(filter);
    }
}