import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from './warehouse-entity';
import { IWarehouseInstanceRepository } from './warehouse-repository';

export interface IWarehouseInstanceDomainService {
  getAllWarehouseInstances(): Promise<WarehouseInstance[]>;
  getWarehouseInstanceById(id: string): Promise<WarehouseInstance | null>;
  createWarehouseInstance(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance>;
  updateWarehouseInstance(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance>;
  deleteWarehouseInstance(id: string): Promise<void>;
}

export class WarehouseInstanceDomainService implements IWarehouseInstanceDomainService {
  constructor(private readonly repository: IWarehouseInstanceRepository) { }

  async getAllWarehouseInstances(): Promise<WarehouseInstance[]> {
    return this.repository.list();
  }

  async getWarehouseInstanceById(id: string): Promise<WarehouseInstance | null> {
    if (!id?.trim()) {
      throw new Error('倉庫 ID 不能為空');
    }
    return this.repository.getById(id);
  }

  async createWarehouseInstance(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance> {
    if (!data.name?.trim()) {
      throw new Error('倉庫名稱不能為空');
    }
    return this.repository.create(data);
  }

  async updateWarehouseInstance(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance> {
    if (!id?.trim()) {
      throw new Error('倉庫 ID 不能為空');
    }
    return this.repository.update(id, data);
  }

  async deleteWarehouseInstance(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('倉庫 ID 不能為空');
    }
    return this.repository.delete(id);
  }
}
