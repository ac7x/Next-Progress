import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import { Warehouse, WarehouseItem } from '../../domain/entities';
import { WarehouseItemTypeEnum } from '../../domain/value-objects';

/**
 * 倉庫資料傳輸物件
 */
export interface WarehouseDTO {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 建立倉庫的輸入 DTO
 */
export interface CreateWarehouseDTO {
    name: string;
    description?: string | null;
    location?: string | null;
    isActive?: boolean;
}

/**
 * 更新倉庫的輸入 DTO
 */
export interface UpdateWarehouseDTO {
    name?: string;
    description?: string | null;
    location?: string | null;
    isActive?: boolean;
}

/**
 * 將倉庫實體轉換為 DTO
 * @param warehouse 倉庫實體
 */
export function toWarehouseDTO(warehouse: Warehouse): WarehouseDTO {
    return {
        id: warehouse.id,
        name: warehouse.name,
        description: warehouse.description,
        location: warehouse.location || null,
        isActive: warehouse.isActive,
        createdAt: warehouse.createdAt,
        updatedAt: warehouse.updatedAt
    };
}

/**
 * 將多個倉庫實體轉換為 DTO 陣列
 * @param warehouses 倉庫實體陣列
 */
export function toWarehouseDTOArray(warehouses: Warehouse[]): WarehouseDTO[] {
    return warehouses.map(toWarehouseDTO);
}

/**
 * 倉庫物品資料傳輸物件
 */
export interface WarehouseItemDTO {
    id: string;
    name: string;
    description: string | null;
    quantity: number;
    warehouseId: string;
    tags: { id: string; name: string; type: TagRelationType }[];
    unit?: string | null;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    typeName?: string; // 類型的本地化名稱
}

/**
 * 建立倉庫物品的輸入 DTO
 */
export interface CreateWarehouseItemDTO {
    name: string;
    description?: string | null;
    quantity: number;
    warehouseId: string;
    tags?: string[] | null;
    unit?: string | null;
    type: string;
}

/**
 * 更新倉庫物品的輸入 DTO
 */
export interface UpdateWarehouseItemDTO {
    name?: string;
    description?: string | null;
    quantity?: number;
    warehouseId?: string;
    tags?: string[] | null;
    unit?: string | null;
    type?: string;
}

/**
 * 將倉庫物品實體轉換為 DTO
 * @param item 倉庫物品實體
 */
export function toWarehouseItemDTO(item: WarehouseItem): WarehouseItemDTO {
    // 獲取類型的本地化名稱
    const typeNames: Record<string, string> = {
        [WarehouseItemTypeEnum.TOOL]: '工具',
        [WarehouseItemTypeEnum.EQUIPMENT]: '設備',
        [WarehouseItemTypeEnum.CONSUMABLE]: '耗材'
    };

    return {
        id: item.id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        warehouseId: item.warehouseId,
        tags: item.tags || [],
        unit: item.unit,
        type: item.type,
        typeName: typeNames[item.type] || item.type,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    };
}

/**
 * 將多個倉庫物品實體轉換為 DTO 陣列
 * @param items 倉庫物品實體陣列
 */
export function toWarehouseItemDTOArray(items: WarehouseItem[]): WarehouseItemDTO[] {
    return items.map(toWarehouseItemDTO);
}
