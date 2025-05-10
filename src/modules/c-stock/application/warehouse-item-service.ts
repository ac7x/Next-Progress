import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { IWarehouseItemDomainService, WarehouseItemDomainService } from '@/modules/c-stock/domain/warehouse-item-service';
import { warehouseItemRepository } from '@/modules/c-stock/infrastructure/repositories/warehouse-item-repository';

export class WarehouseItemApplicationService {
  constructor(private readonly domainService: IWarehouseItemDomainService) { }

  // Query
  async getAllWarehouseItems(): Promise<WarehouseItem[]> {
    return this.domainService.getAllWarehouseItems();
  }
  async getWarehouseItemsByWarehouse(warehouseId: string): Promise<WarehouseItem[]> {
    return this.domainService.getWarehouseItemsByWarehouse(warehouseId);
  }
  async getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
    return this.domainService.getWarehouseItemById(id);
  }

  // Command
  async createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
    return this.domainService.createWarehouseItem(data);
  }
  async updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
    return this.domainService.updateWarehouseItem(id, data);
  }
  async deleteWarehouseItem(id: string): Promise<void> {
    return this.domainService.deleteWarehouseItem(id);
  }
}

// 實例化供 Server Action 使用
const domainService = new WarehouseItemDomainService(warehouseItemRepository);
export const warehouseItemService = new WarehouseItemApplicationService(domainService);
