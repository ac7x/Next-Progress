import { TagRelationType } from '@/modules/c-tag/domain/tag-entity';
// 直接引用 Prisma 生成的 enum
import { WarehouseItemType as PrismaWarehouseItemType } from '@prisma/client';

// 型別 alias，供 domain 層使用
export type WarehouseItemType = PrismaWarehouseItemType;

export interface WarehouseItem {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  warehouseId: string;
  tags: { id: string; name: string; type: TagRelationType }[];
  unit?: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: WarehouseItemType; // 使用 Prisma 型別
}

export interface CreateWarehouseItemProps {
  name: string;
  description?: string | null;
  quantity: number;
  warehouseId: string;
  tags?: string[] | null;
  unit?: string | null;
  type: WarehouseItemType; // 使用 Prisma 型別
}

export interface UpdateWarehouseItemProps {
  name?: string;
  description?: string | null;
  quantity?: number;
  warehouseId?: string;
  tags?: string[] | null;
  unit?: string | null;
  // type 不允許更新（如需允許可加上）
}

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
