import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from './warehouse-entity';
import { IWarehouseRepository } from './warehouse-repository';

export interface IWarehouseDomainService {
  getAllWarehouses(): Promise<Warehouse[]>;
  getWarehouseById(id: string): Promise<Warehouse | null>;
  createWarehouse(data: CreateWarehouseProps): Promise<Warehouse>;
  updateWarehouse(id: string, data: UpdateWarehouseProps): Promise<Warehouse>;
  deleteWarehouse(id: string): Promise<void>;
}

export class WarehouseDomainService implements IWarehouseDomainService {
  constructor(private readonly repository: IWarehouseRepository) {}

  async getAllWarehouses(): Promise<Warehouse[]> {
    return this.repository.list();
  }

  async getWarehouseById(id: string): Promise<Warehouse | null> {
    if (!id?.trim()) {
      throw new Error('倉庫 ID 不能為空');
    }
    return this.repository.getById(id);
  }

  async createWarehouse(data: CreateWarehouseProps): Promise<Warehouse> {
    if (!data.name?.trim()) {
      throw new Error('倉庫名稱不能為空');
    }
    return this.repository.create(data);
  }

  async updateWarehouse(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
    if (!id?.trim()) {
      throw new Error('倉庫 ID 不能為空');
    }
    return this.repository.update(id, data);
  }

  async deleteWarehouse(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('倉庫 ID 不能為空');
    }
    return this.repository.delete(id);
  }
}
