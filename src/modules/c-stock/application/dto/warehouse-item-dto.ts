import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import { WarehouseItem, WarehouseItemTypeEnum } from '../../domain/entities/warehouse-item-entity';

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