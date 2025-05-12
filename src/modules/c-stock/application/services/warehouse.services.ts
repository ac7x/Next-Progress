import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '../../domain/entities';
import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '../../domain/entities';
import { IWarehouseItemRepository, IWarehouseRepository } from '../../domain/repositories';
import { WarehouseItemService as DomainWarehouseItemService } from '../../domain/services';
import { WarehouseService as DomainWarehouseService } from '../../domain/services';

/**
 * 倉庫應用服務 - 協調領域服務和基礎設施
 */
export class WarehouseApplicationService {
    private readonly domainService: DomainWarehouseService;

    constructor(warehouseRepository: IWarehouseRepository) {
        this.domainService = new DomainWarehouseService(warehouseRepository);
    }

    /**
     * 創建新倉庫
     * @param data 倉庫創建資料
     */
    async createWarehouse(data: CreateWarehouseProps): Promise<Warehouse> {
        return this.domainService.createWarehouse(data);
    }

    /**
     * 更新倉庫資訊
     * @param id 倉庫ID
     * @param data 更新資料
     */
    async updateWarehouse(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
        return this.domainService.updateWarehouse(id, data);
    }

    /**
     * 刪除倉庫
     * @param id 倉庫ID
     */
    async deleteWarehouse(id: string): Promise<boolean> {
        return this.domainService.deleteWarehouse(id);
    }

    /**
     * 根據ID查找倉庫
     * @param id 倉庫ID
     */
    async getWarehouseById(id: string): Promise<Warehouse | null> {
        return this.domainService.getWarehouseById(id);
    }

    /**
     * 獲取所有倉庫
     * @param options 分頁和排序選項
     */
    async getAllWarehouses(options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' }
    }): Promise<Warehouse[]> {
        return this.domainService.getAllWarehouses(options);
    }

    /**
     * 啟用倉庫
     * @param id 倉庫ID
     */
    async activateWarehouse(id: string): Promise<Warehouse> {
        return this.domainService.activateWarehouse(id);
    }

    /**
     * 停用倉庫
     * @param id 倉庫ID
     */
    async deactivateWarehouse(id: string): Promise<Warehouse> {
        return this.domainService.deactivateWarehouse(id);
    }

    /**
     * 獲取倉庫總數
     * @param onlyActive 是否僅計算活動倉庫
     */
    async getWarehouseCount(onlyActive?: boolean): Promise<number> {
        return this.domainService.getWarehouseCount(onlyActive);
    }
}

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
