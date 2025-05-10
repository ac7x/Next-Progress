import { CreateWarehouseItemDTO, UpdateWarehouseItemDTO } from '@/modules/c-stock/application/dto/warehouse-item-dto';
import { WarehouseItem } from '@/modules/c-stock/domain/entities/warehouse-item-entity';
import { IWarehouseItemRepository } from '@/modules/c-stock/domain/repositories/warehouse-item-repository-interface';
import { IWarehouseRepository } from '@/modules/c-stock/domain/repositories/warehouse-repository-interface';
import { WarehouseItemService as WarehouseItemDomainService } from '@/modules/c-stock/domain/services/warehouse-item-service';
import { revalidatePath } from 'next/cache';

/**
 * 倉庫物品應用服務 - 負責協調倉庫物品領域邏輯與基礎設施，處理跨領域關注點
 */
export class WarehouseItemApplicationService {
    private readonly domainService: WarehouseItemDomainService;

    constructor(
        private readonly warehouseItemRepository: IWarehouseItemRepository,
        private readonly warehouseRepository: IWarehouseRepository
    ) {
        this.domainService = new WarehouseItemDomainService(warehouseItemRepository, warehouseRepository);
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
        try {
            return await this.domainService.getAllWarehouseItems(options);
        } catch (error) {
            console.error('獲取倉庫物品列表失敗:', error);
            throw error;
        }
    }

    /**
     * 根據倉庫ID獲取物品
     */
    async getItemsByWarehouseId(warehouseId: string): Promise<WarehouseItem[]> {
        try {
            return await this.domainService.getItemsByWarehouseId(warehouseId);
        } catch (error) {
            console.error(`獲取倉庫 ID:${warehouseId} 的物品失敗:`, error);
            throw error;
        }
    }

    /**
     * 根據ID獲取倉庫物品
     */
    async getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
        try {
            return await this.domainService.getWarehouseItemById(id);
        } catch (error) {
            console.error(`獲取倉庫物品 ID:${id} 失敗:`, error);
            throw error;
        }
    }

    /**
     * 創建新倉庫物品並刷新相關頁面快取
     */
    async createWarehouseItem(data: CreateWarehouseItemDTO): Promise<WarehouseItem> {
        try {
            const item = await this.domainService.createWarehouseItem(data);
            revalidatePath(`/client/warehouse_instance`);
            return item;
        } catch (error) {
            console.error('創建倉庫物品失敗:', error);
            throw error;
        }
    }

    /**
     * 批量創建倉庫物品並刷新相關頁面快取
     */
    async createManyWarehouseItems(
        items: Omit<CreateWarehouseItemDTO, 'warehouseId'>[],
        warehouseId: string
    ): Promise<number> {
        try {
            const count = await this.domainService.createManyWarehouseItems(items, warehouseId);
            revalidatePath(`/client/warehouse_instance`);
            return count;
        } catch (error) {
            console.error(`批量創建倉庫物品到倉庫 ID:${warehouseId} 失敗:`, error);
            throw error;
        }
    }

    /**
     * 更新倉庫物品資訊並刷新相關頁面快取
     */
    async updateWarehouseItem(id: string, data: UpdateWarehouseItemDTO): Promise<WarehouseItem> {
        try {
            const item = await this.domainService.updateWarehouseItem(id, data);
            revalidatePath(`/client/warehouse_instance`);
            return item;
        } catch (error) {
            console.error(`更新倉庫物品 ID:${id} 失敗:`, error);
            throw error;
        }
    }

    /**
     * 更新倉庫物品數量並刷新相關頁面快取
     */
    async updateWarehouseItemQuantity(id: string, quantity: number): Promise<WarehouseItem> {
        try {
            const item = await this.domainService.updateWarehouseItemQuantity(id, quantity);
            revalidatePath(`/client/warehouse_instance`);
            return item;
        } catch (error) {
            console.error(`更新倉庫物品 ID:${id} 數量失敗:`, error);
            throw error;
        }
    }

    /**
     * 刪除倉庫物品並刷新相關頁面快取
     */
    async deleteWarehouseItem(id: string): Promise<void> {
        try {
            await this.domainService.deleteWarehouseItem(id);
            revalidatePath(`/client/warehouse_instance`);
        } catch (error) {
            console.error(`刪除倉庫物品 ID:${id} 失敗:`, error);
            throw error;
        }
    }

    /**
     * 搜索倉庫物品
     */
    async searchWarehouseItems(query: string, options?: {
        warehouseId?: string;
        skip?: number;
        take?: number;
    }): Promise<WarehouseItem[]> {
        try {
            return await this.domainService.searchWarehouseItems(query, options);
        } catch (error) {
            console.error(`搜索倉庫物品失敗:`, error);
            throw error;
        }
    }
}