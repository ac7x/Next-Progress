import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '@/modules/c-stock/domain/warehouse-entity';
import { IWarehouseDomainService, WarehouseDomainService } from '@/modules/c-stock/domain/warehouse-service';
import { warehouseRepository } from '@/modules/c-stock/infrastructure/warehouse-repository';

export class WarehouseApplicationService {
  constructor(private readonly domainService: IWarehouseDomainService) { }

  async getAllWarehouses(): Promise<Warehouse[]> {
    return this.domainService.getAllWarehouses();
  }

  async getWarehouseById(id: string): Promise<Warehouse | null> {
    return this.domainService.getWarehouseById(id);
  }

  async createWarehouse(data: CreateWarehouseProps): Promise<Warehouse> {
    const warehouse = await this.domainService.createWarehouse(data);
    console.log(`倉庫 ${warehouse.name} 已創建，ID: ${warehouse.id}`);
    return warehouse;
  }

  async updateWarehouse(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
    return this.domainService.updateWarehouse(id, data);
  }

  async deleteWarehouse(id: string): Promise<void> {
    return this.domainService.deleteWarehouse(id);
  }
}

// 注入依賴
const domainService = new WarehouseDomainService(warehouseRepository);
export const warehouseService = new WarehouseApplicationService(domainService);
