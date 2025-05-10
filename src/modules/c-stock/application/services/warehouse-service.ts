import { CreateWarehouseDTO, UpdateWarehouseDTO, WarehouseDTO } from '@/modules/c-stock/application/dto/warehouse-dto';
import { Warehouse } from '@/modules/c-stock/domain/entities/warehouse-entity';
import { IWarehouseRepository } from '@/modules/c-stock/domain/repositories/warehouse-repository-interface';
import { WarehouseService as WarehouseDomainService } from '@/modules/c-stock/domain/services/warehouse-service';
import { revalidatePath } from 'next/cache';

/**
 * 倉庫應用服務 - 負責協調倉庫領域邏輯與基礎設施，處理跨領域關注點
 */
export class WarehouseApplicationService {
  private readonly domainService: WarehouseDomainService;
  
  constructor(private readonly repository: IWarehouseRepository) {
    this.domainService = new WarehouseDomainService(repository);
  }

  /**
   * 獲取所有倉庫
   */
  async getAllWarehouses(): Promise<Warehouse[]> {
    try {
      return await this.domainService.getAllWarehouses();
    } catch (error) {
      console.error('獲取倉庫列表失敗:', error);
      throw error;
    }
  }

  /**
   * 根據ID獲取倉庫
   */
  async getWarehouseById(id: string): Promise<Warehouse | null> {
    try {
      return await this.domainService.getWarehouseById(id);
    } catch (error) {
      console.error(`獲取倉庫 ID:${id} 失敗:`, error);
      throw error;
    }
  }

  /**
   * 創建新倉庫並刷新相關頁面快取
   */
  async createWarehouse(data: CreateWarehouseDTO): Promise<Warehouse> {
    try {
      const warehouse = await this.domainService.createWarehouse(data);
      revalidatePath('/client/warehouse_instance');
      return warehouse;
    } catch (error) {
      console.error('創建倉庫失敗:', error);
      throw error;
    }
  }

  /**
   * 更新倉庫資訊並刷新相關頁面快取
   */
  async updateWarehouse(id: string, data: UpdateWarehouseDTO): Promise<Warehouse> {
    try {
      const warehouse = await this.domainService.updateWarehouse(id, data);
      revalidatePath('/client/warehouse_instance');
      return warehouse;
    } catch (error) {
      console.error(`更新倉庫 ID:${id} 失敗:`, error);
      throw error;
    }
  }

  /**
   * 刪除倉庫並刷新相關頁面快取
   */
  async deleteWarehouse(id: string): Promise<void> {
    try {
      await this.domainService.deleteWarehouse(id);
      revalidatePath('/client/warehouse_instance');
    } catch (error) {
      console.error(`刪除倉庫 ID:${id} 失敗:`, error);
      throw error;
    }
  }

  /**
   * 啟用倉庫
   */
  async activateWarehouse(id: string): Promise<Warehouse> {
    try {
      const warehouse = await this.domainService.activateWarehouse(id);
      revalidatePath('/client/warehouse_instance');
      return warehouse;
    } catch (error) {
      console.error(`啟用倉庫 ID:${id} 失敗:`, error);
      throw error;
    }
  }

  /**
   * 停用倉庫
   */
  async deactivateWarehouse(id: string): Promise<Warehouse> {
    try {
      const warehouse = await this.domainService.deactivateWarehouse(id);
      revalidatePath('/client/warehouse_instance');
      return warehouse;
    } catch (error) {
      console.error(`停用倉庫 ID:${id} 失敗:`, error);
      throw error;
    }
  }
}