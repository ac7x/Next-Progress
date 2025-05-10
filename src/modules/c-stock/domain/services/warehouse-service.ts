import {
    CreateWarehouseProps,
    UpdateWarehouseProps,
    Warehouse
} from '../entities/warehouse-entity';
import {
    WarehouseCreatedEvent,
    WarehouseDeletedEvent,
    WarehouseUpdatedEvent
} from '../events';
import { IWarehouseRepository } from '../repositories/warehouse-repository-interface';

/**
 * 倉庫領域服務 - 實現倉庫相關的業務邏輯
 */
export class WarehouseService {
    constructor(private readonly warehouseRepository: IWarehouseRepository) { }

    /**
     * 創建新倉庫
     * @param data 創建資料
     */
    async createWarehouse(data: CreateWarehouseProps): Promise<Warehouse> {
        // 檢查同名倉庫是否已存在
        const existingWarehouse = await this.warehouseRepository.findByName(data.name);
        if (existingWarehouse) {
            throw new Error(`倉庫名稱 "${data.name}" 已存在`);
        }

        // 創建倉庫
        const warehouse = await this.warehouseRepository.create(data);

        // 發布倉庫創建事件
        const event = new WarehouseCreatedEvent(warehouse);
        // 事件發布邏輯將在基礎設施層實現

        return warehouse;
    }

    /**
     * 更新倉庫資訊
     * @param id 倉庫ID
     * @param data 更新資料
     */
    async updateWarehouse(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
        // 檢查倉庫是否存在
        const existingWarehouse = await this.warehouseRepository.findById(id);
        if (!existingWarehouse) {
            throw new Error(`倉庫 ID "${id}" 不存在`);
        }

        // 如果要更新名稱，檢查名稱是否已被使用
        if (data.name && data.name !== existingWarehouse.name) {
            const warehouseWithSameName = await this.warehouseRepository.findByName(data.name);
            if (warehouseWithSameName && warehouseWithSameName.id !== id) {
                throw new Error(`倉庫名稱 "${data.name}" 已被使用`);
            }
        }

        // 保存更新前的值用於事件
        const previousValues = { ...existingWarehouse };

        // 更新倉庫
        const updatedWarehouse = await this.warehouseRepository.update(id, data);

        // 發布倉庫更新事件
        const event = new WarehouseUpdatedEvent(updatedWarehouse, previousValues);
        // 事件發布邏輯將在基礎設施層實現

        return updatedWarehouse;
    }

    /**
     * 刪除倉庫
     * @param id 倉庫ID
     */
    async deleteWarehouse(id: string): Promise<boolean> {
        // 檢查倉庫是否存在
        const existingWarehouse = await this.warehouseRepository.findById(id);
        if (!existingWarehouse) {
            throw new Error(`倉庫 ID "${id}" 不存在`);
        }

        // 刪除倉庫
        const result = await this.warehouseRepository.delete(id);

        if (result) {
            // 發布倉庫刪除事件
            const event = new WarehouseDeletedEvent(id);
            // 事件發布邏輯將在基礎設施層實現
        }

        return result;
    }

    /**
     * 獲取單個倉庫
     * @param id 倉庫ID
     */
    async getWarehouse(id: string): Promise<Warehouse | null> {
        return this.warehouseRepository.findById(id);
    }

    /**
     * 獲取所有倉庫
     */
    async getAllWarehouses(options?: {
        skip?: number;
        take?: number;
        orderBy?: { [key: string]: 'asc' | 'desc' }
    }): Promise<Warehouse[]> {
        return this.warehouseRepository.findAll(options);
    }

    /**
     * 根據名稱獲取倉庫
     */
    async getWarehouseByName(name: string): Promise<Warehouse | null> {
        return this.warehouseRepository.findByName(name);
    }

    /**
     * 獲取倉庫數量
     */
    async getWarehousesCount(filter?: { isActive?: boolean }): Promise<number> {
        return this.warehouseRepository.count(filter);
    }
}