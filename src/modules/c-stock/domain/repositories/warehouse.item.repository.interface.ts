import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '../entities/warehouse.item.entity';

/**
 * 倉庫物品儲存庫介面 - 定義倉庫物品實體的持久化操作
 */
export interface IWarehouseItemRepository {
    /**
     * 根據ID查找倉庫物品
     * @param id 物品ID
     */
    findById(id: string): Promise<WarehouseItem | null>;

    /**
     * 查詢所有倉庫物品
     * @param options 查詢選項
     */
    findAll(options?: {
        warehouseId?: string;
        type?: string;
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    }): Promise<WarehouseItem[]>;

    /**
     * 根據倉庫ID查詢物品
     * @param warehouseId 倉庫ID
     * @param options 查詢選項
     */
    findByWarehouseId(warehouseId: string, options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    }): Promise<WarehouseItem[]>;

    /**
     * 創建新倉庫物品
     * @param data 倉庫物品創建資料
     */
    create(data: CreateWarehouseItemProps): Promise<WarehouseItem>;

    /**
     * 批量創建倉庫物品
     * @param dataList 倉庫物品創建資料列表
     */
    createMany(dataList: CreateWarehouseItemProps[]): Promise<number>;

    /**
     * 更新倉庫物品資訊
     * @param id 物品ID
     * @param data 更新資料
     */
    update(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem>;

    /**
     * 更新物品數量
     * @param id 物品ID
     * @param quantity 新數量
     */
    updateQuantity(id: string, quantity: number): Promise<WarehouseItem>;

    /**
     * 刪除倉庫物品
     * @param id 物品ID
     */
    delete(id: string): Promise<boolean>;

    /**
     * 根據倉庫ID刪除所有物品
     * @param warehouseId 倉庫ID
     */
    deleteByWarehouseId(warehouseId: string): Promise<number>;

    /**
     * 獲取物品總數
     * @param filter 過濾條件
     */
    count(filter?: { warehouseId?: string; type?: string }): Promise<number>;

    /**
     * 搜索倉庫物品
     * @param query 搜索關鍵詞
     * @param options 搜索選項
     */
    search(query: string, options?: {
        warehouseId?: string;
        skip?: number;
        take?: number;
    }): Promise<WarehouseItem[]>;
}