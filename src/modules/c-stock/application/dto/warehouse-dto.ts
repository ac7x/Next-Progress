import { Warehouse } from '../../domain/entities/warehouse-entity';

/**
 * 倉庫資料傳輸物件
 */
export interface WarehouseDto {
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
export interface CreateWarehouseDto {
    name: string;
    description?: string | null;
    location?: string | null;
    isActive?: boolean;
}

/**
 * 更新倉庫的輸入 DTO
 */
export interface UpdateWarehouseDto {
    name?: string;
    description?: string | null;
    location?: string | null;
    isActive?: boolean;
}

/**
 * 將倉庫實體轉換為 DTO
 * @param warehouse 倉庫實體
 */
export function toWarehouseDto(warehouse: Warehouse): WarehouseDto {
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
export function toWarehouseDtoArray(warehouses: Warehouse[]): WarehouseDto[] {
    return warehouses.map(toWarehouseDto);
}