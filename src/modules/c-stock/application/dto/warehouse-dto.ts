import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '@/modules/c-stock/domain/entities/warehouse-entity';

/**
 * 倉庫 DTO - 用於應用層與介面層之間的資料傳輸
 */
export interface WarehouseDTO extends Warehouse {
    // 可擴展屬性，例如統計資料或關聯資料
    itemCount?: number;
}

/**
 * 創建倉庫的輸入 DTO
 */
export type CreateWarehouseDTO = CreateWarehouseProps;

/**
 * 更新倉庫的輸入 DTO
 */
export type UpdateWarehouseDTO = UpdateWarehouseProps;

/**
 * 倉庫列表項目 DTO - 用於列表顯示
 */
export interface WarehouseListItemDTO {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    isActive: boolean;
    itemCount: number;
    createdAt: Date;
    updatedAt: Date;
}