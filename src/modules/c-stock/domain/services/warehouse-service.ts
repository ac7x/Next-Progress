import {
    CreateWarehouseProps,
    UpdateWarehouseProps,
    Warehouse
} from '../entities/warehouse-entity';
import { WarehouseCreatedEvent } from '../events/warehouse-created-event';
import { WarehouseDeletedEvent } from '../events/warehouse-deleted-event';
import { WarehouseUpdatedEvent } from '../events/warehouse-updated-event';
import { IWarehouseRepository } from '../repositories/warehouse-repository-interface';

/**
 * 倉庫領域服務 - 封裝與倉庫相關的業務邏輯
 */
export class WarehouseService {
    constructor(private readonly warehouseRepository: IWarehouseRepository) { }

    /**
     * 創建新倉庫
     * @param data 倉庫創建資料
     */
    async createWarehouse(data: CreateWarehouseProps): Promise<Warehouse> {
        // 檢查名稱是否已存在
        const existingWarehouse = await this.warehouseRepository.findByName(data.name);
        if (existingWarehouse) {
            throw new Error(`已存在名為 "${data.name}" 的倉庫`);
        }

        // 創建倉庫
        const warehouse = await this.warehouseRepository.create(data);

        // 觸發事件 (實際項目可能會使用事件總線)
        const event = new WarehouseCreatedEvent(warehouse);
        console.log('倉庫創建事件已觸發:', event);

        return warehouse;
    }

    /**
     * 更新倉庫資訊
     * @param id 倉庫ID
     * @param data 更新資料
     */
    async updateWarehouse(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
        // 檢查倉庫是否存在
        const warehouse = await this.warehouseRepository.findById(id);
        if (!warehouse) {
            throw new Error(`找不到 ID 為 ${id} 的倉庫`);
        }

        // 如果嘗試更改名稱，檢查新名稱是否已被占用
        if (data.name && data.name !== warehouse.name) {
            const existingWarehouse = await this.warehouseRepository.findByName(data.name);
            if (existingWarehouse && existingWarehouse.id !== id) {
                throw new Error(`已存在名為 "${data.name}" 的倉庫`);
            }
        }

        // 保存舊值以便事件使用
        const previousValues = { ...warehouse };

        // 更新倉庫
        const updatedWarehouse = await this.warehouseRepository.update(id, data);

        // 觸發事件
        const event = new WarehouseUpdatedEvent(updatedWarehouse, previousValues);
        console.log('倉庫更新事件已觸發:', event);

        return updatedWarehouse;
    }

    /**
     * 刪除倉庫
     * @param id 倉庫ID
     */
    async deleteWarehouse(id: string): Promise<boolean> {
        // 檢查倉庫是否存在
        const warehouse = await this.warehouseRepository.findById(id);
        if (!warehouse) {
            throw new Error(`找不到 ID 為 ${id} 的倉庫`);
        }

        // 刪除倉庫
        const result = await this.warehouseRepository.delete(id);

        // 觸發事件
        const event = new WarehouseDeletedEvent(id);
        console.log('倉庫刪除事件已觸發:', event);

        return result;
    }

    /**
     * 根據ID查找倉庫
     * @param id 倉庫ID
     */
    async getWarehouseById(id: string): Promise<Warehouse | null> {
        return this.warehouseRepository.findById(id);
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
        return this.warehouseRepository.findAll(options);
    }

    /**
     * 啟用倉庫
     * @param id 倉庫ID
     */
    async activateWarehouse(id: string): Promise<Warehouse> {
        return this.updateWarehouse(id, { isActive: true });
    }

    /**
     * 停用倉庫
     * @param id 倉庫ID
     */
    async deactivateWarehouse(id: string): Promise<Warehouse> {
        return this.updateWarehouse(id, { isActive: false });
    }

    /**
     * 獲取倉庫總數
     * @param onlyActive 是否僅計算活動倉庫
     */
    async getWarehouseCount(onlyActive?: boolean): Promise<number> {
        return this.warehouseRepository.count(onlyActive ? { isActive: true } : undefined);
    }
}