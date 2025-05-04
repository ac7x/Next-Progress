import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from './warehouse-entity';

export interface IWarehouseRepository {
  create(data: CreateWarehouseProps): Promise<Warehouse>;
  list(): Promise<Warehouse[]>;
  getById(id: string): Promise<Warehouse | null>;
  update(id: string, data: UpdateWarehouseProps): Promise<Warehouse>;
  delete(id: string): Promise<void>;
}
