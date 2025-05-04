import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { IWarehouseDomainService, WarehouseDomainService } from '@/modules/c-stock/domain/warehouse-service';
import { warehouseRepository } from '@/modules/c-stock/infrastructure/warehouse-repository';

export class WarehouseApplicationService {
  constructor(private readonly domainService: IWarehouseDomainService) { }

  async getAllWarehouses(): Promise<WarehouseInstance[]> {
    return this.domainService.getAllWarehouses();
  }

  async getWarehouseById(id: string): Promise<WarehouseInstance | null> {
    return this.domainService.getWarehouseById(id);
  }

  async createWarehouse(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return this.domainService.createWarehouse(data);
  }

  async updateWarehouse(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return this.domainService.updateWarehouse(id, data);
  }

  async deleteWarehouse(id: string): Promise<void> {
    return this.domainService.deleteWarehouse(id);
  }
}

// 注入依賴
const domainService = new WarehouseDomainService(warehouseRepository);
export const warehouseService = new WarehouseApplicationService(domainService);
