import { WarehouseItemType } from '@prisma/client'; // 🆕 引入 Prisma 定義的 WarehouseItemType
import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from './warehouse-item-entity';
import { IWarehouseItemRepository } from './warehouse-item-repository';

export interface IWarehouseItemDomainService {
  createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem>;
  getAllWarehouseItems(): Promise<WarehouseItem[]>;
  getWarehouseItemsByWarehouse(warehouseId: string): Promise<WarehouseItem[]>;
  getWarehouseItemById(id: string): Promise<WarehouseItem | null>;
  updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem>;
  deleteWarehouseItem(id: string): Promise<void>;
}

export class WarehouseItemDomainService implements IWarehouseItemDomainService {
  constructor(private readonly repository: IWarehouseItemRepository) {}

  async createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
    // 核心領域驗證邏輯
    if (!data.name?.trim()) {
      throw new Error('物品名稱不能為空');
    }
    
    if (!data.warehouseId?.trim()) {
      throw new Error('必須指定所屬倉庫');
    }
    
    if (data.quantity <= 0) {
      throw new Error('數量必須大於 0');
    }
    
    if (!Object.values(WarehouseItemType).includes(data.type)) { // 🆕 修正引用問題
      throw new Error('無效的物品類型');
    }
    
    return this.repository.create(data);
  }

  async getAllWarehouseItems(): Promise<WarehouseItem[]> {
    return this.repository.list();
  }

  async getWarehouseItemsByWarehouse(warehouseId: string): Promise<WarehouseItem[]> {
    if (!warehouseId?.trim()) {
      throw new Error('倉庫 ID 不能為空');
    }
    return this.repository.listByWarehouse(warehouseId);
  }

  async getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
    if (!id?.trim()) {
      throw new Error('物品 ID 不能為空');
    }
    return this.repository.getById(id);
  }

  async updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
    if (!id?.trim()) {
      throw new Error('物品 ID 不能為空');
    }
    
    if (data.quantity !== undefined && data.quantity <= 0) {
      throw new Error('數量必須大於 0');
    }
    
    return this.repository.update(id, data);
  }

  async deleteWarehouseItem(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('物品 ID 不能為空');
    }
    return this.repository.delete(id);
  }
}
