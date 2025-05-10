import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '../../domain/entities/warehouse-item-entity';
import { IWarehouseItemRepository } from '../../domain/repositories/warehouse-item-repository-interface';
import { IWarehouseRepository } from '../../domain/repositories/warehouse-repository-interface';
import { WarehouseItemService as DomainWarehouseItemService } from '../../domain/services/warehouse-item-service';

/**
 * 倉庫物品應用服務 - 協調領域服務和基礎設施
 */
export class WarehouseItemApplicationService {
    private readonly domainService: DomainWarehouseItemService;

    constructor(
        warehouseItemRepository: IWarehouseItemRepository,
        warehouseRepository: IWarehouseRepository
    ) {
        this.domainService = new DomainWarehouseItemService(warehouseItemRepository, warehouseRepository);
    }

    /**
     * 創建新倉庫物品
     * @param data 倉庫物品創建資料
     */
    async createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
        return this.domainService.createWarehouseItem(data);
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
        return this.domainService.createManyWarehouseItems(items, warehouseId);
    }

    /**
     * 更新倉庫物品資訊
     * @param id 物品ID
     * @param data 更新資料
     */
    async updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
        return this.domainService.updateWarehouseItem(id, data);
    }

    /**
     * 更新物品數量
     * @param id 物品ID
     * @param quantity 新數量
     */
    async updateWarehouseItemQuantity(id: string, quantity: number): Promise<WarehouseItem> {
        return this.domainService.updateWarehouseItemQuantity(id, quantity);
    }

    /**
     * 刪除倉庫物品
     * @param id 物品ID
     */
    async deleteWarehouseItem(id: string): Promise<boolean> {
        return this.domainService.deleteWarehouseItem(id);
    }

    /**
     * 根據倉庫ID刪除所有物品
     * @param warehouseId 倉庫ID
     */
    async deleteItemsByWarehouseId(warehouseId: string): Promise<number> {
        return this.domainService.deleteItemsByWarehouseId(warehouseId);
    }

    /**
     *
     * 根據ID查找倉庫物品
     * @param id 物品ID
     */
    async getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
        return this.domainService.getWarehouseItemById(id);
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
        return this.domainService.getAllWarehouseItems(options);
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
        return this.domainService.getItemsByWarehouseId(warehouseId, options);
    }

    /**
     * 獲取物品總數
     * @param filter 過濾條件
     */
    async getWarehouseItemCount(filter?: { warehouseId?: string; type?: string }): Promise<number> {
        return this.domainService.getWarehouseItemCount(filter);
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
        return this.domainService.searchWarehouseItems(query, options);
    }
}

// 倉庫物品服務實例將在應用初始化時被注入實際的儲存庫實現
// 這里先導出一個佔位符，實際使用時會被替換
export let warehouseItemService: WarehouseItemApplicationService;