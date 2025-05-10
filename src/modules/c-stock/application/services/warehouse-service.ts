import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '../../domain/entities/warehouse-entity';
import { IWarehouseRepository } from '../../domain/repositories/warehouse-repository-interface';
import { WarehouseService as DomainWarehouseService } from '../../domain/services/warehouse-service';

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

// 倉庫服務實例將在應用初始化時被注入實際的儲存庫實現
// 這里先導出一個佔位符，實際使用時會被替換
export let warehouseService: WarehouseApplicationService;