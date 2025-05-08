import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from './warehouse-item-entity';

export interface IWarehouseItemRepository {
  create(data: CreateWarehouseItemProps): Promise<WarehouseItem>;
  list(): Promise<WarehouseItem[]>;
  listByWarehouse(warehouseId: string): Promise<WarehouseItem[]>;
  getById(id: string): Promise<WarehouseItem | null>;
  update(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem>;
  delete(id: string): Promise<void>;
}
