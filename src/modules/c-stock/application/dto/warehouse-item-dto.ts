import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem, WarehouseItemType } from '@/modules/c-stock/domain/entities/warehouse-item-entity';
import { TagRelationType } from '@/modules/c-tag/domain/tag-entity';

/**
 * 倉庫物品 DTO - 用於應用層與介面層之間的資料傳輸
 */
export interface WarehouseItemDTO extends WarehouseItem {
    // 可擴展屬性，例如額外的關聯資料
    warehouseName?: string;
}

/**
 * 創建倉庫物品的輸入 DTO
 */
export type CreateWarehouseItemDTO = CreateWarehouseItemProps;

/**
 * 更新倉庫物品的輸入 DTO
 */
export type UpdateWarehouseItemDTO = UpdateWarehouseItemProps;

/**
 * 倉庫物品列表項目 DTO - 用於列表顯示
 */
export interface WarehouseItemListItemDTO {
    id: string;
    name: string;
    description: string | null;
    quantity: number;
    unit: string | null;
    type: WarehouseItemType;
    warehouseId: string;
    warehouseName?: string;
    tags: { id: string; name: string; type: TagRelationType }[];
    createdAt: Date;
    updatedAt: Date;
}