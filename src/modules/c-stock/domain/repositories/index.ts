import { CreateWarehouseItemProps, CreateWarehouseProps, UpdateWarehouseItemProps, UpdateWarehouseProps, Warehouse, WarehouseItem } from '../entities';

/**
 * 倉庫儲存庫介面 - 定義倉庫實體的持久化操作
 */
export interface IWarehouseRepository {
    /**
     * 根據ID查找倉庫
     * @param id 倉庫ID
     */
    findById(id: string): Promise<Warehouse | null>;

    /**
     * 查詢所有倉庫
     * @param options 分頁和排序選項
     */
    findAll(options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' }
    }): Promise<Warehouse[]>;

    /**
     * 根據名稱查詢倉庫
     * @param name 倉庫名稱
     */
    findByName(name: string): Promise<Warehouse | null>;

    /**
     * 創建新倉庫
     * @param data 倉庫創建資料
     */
    create(data: CreateWarehouseProps): Promise<Warehouse>;

    /**
     * 更新倉庫資訊
     * @param id 倉庫ID
     * @param data 更新資料
     */
    update(id: string, data: UpdateWarehouseProps): Promise<Warehouse>;

    /**
     * 刪除倉庫
     * @param id 倉庫ID
     */
    delete(id: string): Promise<boolean>;

    /**
     * 獲取倉庫總數
     * @param filter 篩選條件，可以指定只計算活動倉庫
     */
    count(filter?: { isActive?: boolean }): Promise<number>;
}

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
     * @param items 倉庫物品創建資料列表
     */
    createMany(items: CreateWarehouseItemProps[]): Promise<number>;

    /**
     * 更新倉庫物品
     * @param id 物品ID
     * @param data 更新資料
     */
    update(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem>;

    /**
     * 刪除倉庫物品
     * @param id 物品ID
     */
    delete(id: string): Promise<boolean>;

    /**
     * 根據倉庫ID刪除物品
     * @param warehouseId 倉庫ID
     */
    deleteByWarehouseId(warehouseId: string): Promise<number>;

    /**
     * 更新倉庫物品數量
     * @param id 物品ID
     * @param quantity 新數量
     */
    updateQuantity(id: string, quantity: number): Promise<WarehouseItem>;

    /**
     * 添加標籤到倉庫物品
     * @param itemId 物品ID
     * @param tagId 標籤ID
     */
    addTag(itemId: string, tagId: string): Promise<boolean>;

    /**
     * 從倉庫物品移除標籤
     * @param itemId 物品ID
     * @param tagId 標籤ID
     */
    removeTag(itemId: string, tagId: string): Promise<boolean>;

    /**
     * 獲取物品數量
     * @param filter 過濾條件
     */
    count(filter?: { warehouseId?: string; type?: string }): Promise<number>;

    /**
     * 搜尋倉庫物品
     * @param query 搜尋關鍵字
     * @param options 搜尋選項
     */
    search(query: string, options?: {
        warehouseId?: string;
        skip?: number;
        take?: number;
    }): Promise<WarehouseItem[]>;
}
