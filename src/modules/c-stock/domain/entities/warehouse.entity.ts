import {
    WarehouseActiveStatus,
    WarehouseDescription,
    WarehouseLocation,
    WarehouseName
} from '../value-objects/warehouse.vo';

/**
 * 基礎倉庫實體（資料庫層級）
 */
export interface Warehouse {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 建立倉庫的輸入資料
 */
export interface CreateWarehouseProps {
    name: string;
    description?: string | null;
    location?: string | null;
    isActive?: boolean;
}

/**
 * 更新倉庫的輸入資料
 */
export interface UpdateWarehouseProps {
    name?: string;
    description?: string | null;
    location?: string | null;
    isActive?: boolean;
}

/**
 * 豐富的倉庫領域模型 - 使用值物件
 */
export interface RichWarehouse {
    id: string;
    name: WarehouseName;
    description: WarehouseDescription;
    location: WarehouseLocation;
    isActive: WarehouseActiveStatus;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 倉庫工廠 - 負責建立與驗證倉庫實體
 */
export class WarehouseFactory {
    /**
     * 從基本資料創建倉庫領域模型
     * @param props 倉庫屬性
     */
    static create(props: CreateWarehouseProps): Partial<RichWarehouse> {
        return {
            name: new WarehouseName(props.name),
            description: new WarehouseDescription(props.description ?? null),
            location: new WarehouseLocation(props.location ?? null),
            isActive: new WarehouseActiveStatus(props.isActive ?? true)
        };
    }

    /**
     * 將資料庫實體轉換為豐富領域實體
     * @param entity 基本實體
     */
    static toRichModel(entity: Warehouse): RichWarehouse {
        return {
            id: entity.id,
            name: new WarehouseName(entity.name),
            description: new WarehouseDescription(entity.description),
            location: new WarehouseLocation(entity.location),
            isActive: new WarehouseActiveStatus(entity.isActive),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    /**
     * 將豐富領域實體轉換為基本實體
     * @param richEntity 豐富領域實體
     */
    static toBasicModel(richEntity: RichWarehouse): Warehouse {
        return {
            id: richEntity.id,
            name: richEntity.name.getValue(),
            description: richEntity.description.getValue(),
            location: richEntity.location.getValue(),
            isActive: richEntity.isActive.getValue(),
            createdAt: richEntity.createdAt,
            updatedAt: richEntity.updatedAt
        };
    }
}

/**
 * 型別守衛 - 確保型別安全
 * @param warehouse 需要驗證的對象
 */
export function isValidWarehouse(warehouse: unknown): warehouse is Warehouse {
    return typeof warehouse === 'object' &&
        warehouse !== null &&
        'id' in warehouse &&
        'name' in warehouse &&
        'isActive' in warehouse &&
        'createdAt' in warehouse &&
        'updatedAt' in warehouse;
}

// 向後兼容性支援 - 為現有的代碼提供兼容性支持
export type WarehouseInstance = Warehouse;
export type CreateWarehouseInstanceProps = CreateWarehouseProps;
export type UpdateWarehouseInstanceProps = UpdateWarehouseProps;
export const isValidWarehouseInstance = isValidWarehouse;
export const WarehouseInstanceFactory = WarehouseFactory;