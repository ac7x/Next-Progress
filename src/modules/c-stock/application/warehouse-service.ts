import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { IWarehouseDomainService, WarehouseDomainService } from '@/modules/c-stock/domain/warehouse-service';
import { warehouseInstanceRepository } from '@/modules/c-stock/infrastructure/warehouse-repository';

export class WarehouseInstanceApplicationService {
  constructor(private readonly domainService: IWarehouseDomainService) { }

  async getAllWarehouseInstances(): Promise<WarehouseInstance[]> {
    return this.domainService.getAllWarehouseInstances();
  }

  async getWarehouseInstanceById(id: string): Promise<WarehouseInstance | null> {
    return this.domainService.getWarehouseInstanceById(id);
  }

  async createWarehouseInstance(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return this.domainService.createWarehouseInstance(data);
  }

  async updateWarehouseInstance(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
    return this.domainService.updateWarehouseInstance(id, data);
  }

  async deleteWarehouseInstance(id: string): Promise<void> {
    return this.domainService.deleteWarehouseInstance(id);
  }
}

const domainService = new WarehouseDomainService(warehouseInstanceRepository);
export const warehouseInstanceService = new WarehouseInstanceApplicationService(domainService);
