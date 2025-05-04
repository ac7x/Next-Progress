import { TagRelationType } from '@/modules/c-tag/domain/tag-entity';
import { WarehouseItemType as PrismaWarehouseItemType } from '@prisma/client';

export { PrismaWarehouseItemType as WarehouseItemType };

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
  type: PrismaWarehouseItemType;
}

export interface CreateWarehouseItemProps {
  name: string;
  description?: string | null;
  quantity: number;
  warehouseId: string;
  tags?: string[] | null;
  unit?: string | null;
  type: PrismaWarehouseItemType;
}

export interface UpdateWarehouseItemProps {
  name?: string;
  description?: string | null;
  quantity?: number;
  warehouseId?: string;
  tags?: string[] | null;
  unit?: string | null;
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
