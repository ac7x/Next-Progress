import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '../entities/warehouse-entity';

/**
 * 倉庫儲存庫接口 - 定義倉庫實體的持久化操作
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
     */
    count(filter?: { isActive?: boolean }): Promise<number>;
}