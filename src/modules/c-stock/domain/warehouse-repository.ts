import { CreateWarehouseInstanceProps, UpdateWarehouseInstanceProps, WarehouseInstance } from './warehouse-entity';

export interface IWarehouseRepository {
  create(data: CreateWarehouseInstanceProps): Promise<WarehouseInstance>;
  list(): Promise<WarehouseInstance[]>;
  getById(id: string): Promise<WarehouseInstance | null>;
  update(id: string, data: UpdateWarehouseInstanceProps): Promise<WarehouseInstance>;
  delete(id: string): Promise<void>;
}
