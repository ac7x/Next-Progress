import { WarehouseItemType } from '@prisma/client'; // 🆕 引入 Prisma 定義的 WarehouseItemType

export interface WarehouseItem {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  warehouseId: string;
  tags: { id: string; name: string; type: string }[]; // 🆕 包含標籤詳細信息
  unit?: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: WarehouseItemType; // 🆕 使用正確的 WarehouseItemType
}

export interface CreateWarehouseItemProps {
  name: string;
  description?: string | null;
  quantity: number;
  warehouseId: string;
  tags?: string[] | null;
  unit?: string | null;
  type: WarehouseItemType; // 🆕 使用正確的 WarehouseItemType
}

export interface UpdateWarehouseItemProps {
  name?: string;
  description?: string | null;
  quantity?: number;
  warehouseId?: string;
  tags?: string[] | null;
  unit?: string | null;
}

// 型別守衛函數
export function isValidWarehouseItem(item: unknown): item is WarehouseItem {
  return typeof item === 'object' && 
    item !== null &&
    'id' in item &&
    'name' in item &&
    'quantity' in item &&
    'warehouseId' in item &&
    'createdAt' in item &&
    'updatedAt' in item;
}
