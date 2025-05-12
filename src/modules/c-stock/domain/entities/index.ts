import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import {
    WarehouseItemDescription,
    WarehouseItemName,
    WarehouseItemQuantity,
    WarehouseItemType
} from '../value-objects';
import {
    WarehouseActiveStatus,
    WarehouseDescription,
    WarehouseLocation,
    WarehouseName
} from '../value-objects';

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
    tags?: { id: string; name: string; type: any }[]; // 添加標籤支持，符合 adapter 已實現的功能
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

/**
 * 基礎倉庫物品實體（資料庫層級）
 */
export interface WarehouseItem {
    id: string;
    name: string;
    description: string | null;
    quantity: number;
    warehouseId: string;
    tags: { id: string; name: string; type: TagRelationType }[];
    unit?: string | null;
    type: string; // 存儲為字符串，對應 WarehouseItemTypeEnum
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 建立倉庫物品的輸入資料
 */
export interface CreateWarehouseItemProps {
    name: string;
    description?: string | null;
    quantity: number;
    warehouseId: string;
    tags?: string[] | null;
    unit?: string | null;
    type: string; // 使用字符串以兼容 Prisma 和域模型
}

/**
 * 更新倉庫物品的輸入資料
 */
export interface UpdateWarehouseItemProps {
    name?: string;
    description?: string | null;
    quantity?: number;
    warehouseId?: string;
    tags?: string[] | null;
    unit?: string | null;
    type?: string; // 使用字符串以兼容 Prisma 和域模型
}

/**
 * 豐富的倉庫物品領域模型 - 使用值物件
 */
export interface RichWarehouseItem {
    id: string;
    name: WarehouseItemName;
    description: WarehouseItemDescription;
    quantity: WarehouseItemQuantity;
    warehouseId: string;
    tags: { id: string; name: string; type: TagRelationType }[];
    unit?: string | null;
    type: WarehouseItemType;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 倉庫物品工廠 - 負責建立與驗證倉庫物品實體
 */
export class WarehouseItemFactory {
    /**
     * 從基本資料創建倉庫物品領域模型
     * @param props 倉庫物品屬性
     */
    static create(props: CreateWarehouseItemProps): Partial<RichWarehouseItem> {
        return {
            name: new WarehouseItemName(props.name),
            description: new WarehouseItemDescription(props.description ?? null),
            quantity: new WarehouseItemQuantity(props.quantity),
            warehouseId: props.warehouseId,
            type: new WarehouseItemType(props.type),
            unit: props.unit,
            tags: [] // 標籤將由儲存庫處理
        };
    }

    /**
     * 將資料庫實體轉換為豐富領域實體
     * @param entity 基本實體
     */
    static toRichModel(entity: WarehouseItem): RichWarehouseItem {
        return {
            id: entity.id,
            name: new WarehouseItemName(entity.name),
            description: new WarehouseItemDescription(entity.description),
            quantity: new WarehouseItemQuantity(entity.quantity),
            warehouseId: entity.warehouseId,
            type: new WarehouseItemType(entity.type),
            unit: entity.unit,
            tags: entity.tags,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    /**
     * 將豐富領域實體轉換為基本實體
     * @param richEntity 豐富領域實體
     */
    static toBasicModel(richEntity: RichWarehouseItem): WarehouseItem {
        return {
            id: richEntity.id,
            name: richEntity.name.getValue(),
            description: richEntity.description.getValue(),
            quantity: richEntity.quantity.getValue(),
            warehouseId: richEntity.warehouseId,
            type: richEntity.type.getValue(),
            unit: richEntity.unit,
            tags: richEntity.tags,
            createdAt: richEntity.createdAt,
            updatedAt: richEntity.updatedAt
        };
    }
}

/**
 * 型別守衛 - 確保型別安全
 * @param item 需要驗證的對象
 */
export function isValidWarehouseItem(item: unknown): item is WarehouseItem {
    return (
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'name' in item &&
        'quantity' in item &&
        'warehouseId' in item &&
        'type' in item &&
        'createdAt' in item &&
        'updatedAt' in item
    );
}

