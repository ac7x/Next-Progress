import { TagRelationType } from '@/modules/c-tag/domain/entities/tag-entity';
import {
    WarehouseItemDescription,
    WarehouseItemName,
    WarehouseItemQuantity,
    WarehouseItemType
} from '../value-objects/warehouse.item.vo';

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

