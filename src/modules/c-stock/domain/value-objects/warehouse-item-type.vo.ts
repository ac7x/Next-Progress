/**
 * 倉庫物品類型 - 枚舉定義
 * 需要與 Prisma 的 WarehouseItemType 枚舉保持一致
 */
export enum WarehouseItemTypeEnum {
    TOOL = 'TOOL',           // 工具
    EQUIPMENT = 'EQUIPMENT', // 設備
    CONSUMABLE = 'CONSUMABLE' // 耗材
}

/**
 * 倉庫物品類型值物件 - 確保物品類型符合業務規則
 */
export class WarehouseItemType {
    private readonly value: WarehouseItemTypeEnum;

    constructor(value: string) {
        // 驗證輸入類型是否為有效的 WarehouseItemType
        if (!Object.values(WarehouseItemTypeEnum).includes(value as WarehouseItemTypeEnum)) {
            throw new Error(`無效的物品類型：${value}。有效類型為：${Object.values(WarehouseItemTypeEnum).join(', ')}`);
        }
        this.value = value as WarehouseItemTypeEnum;
    }

    getValue(): string {
        return this.value;
    }

    equals(other: WarehouseItemType): boolean {
        return this.value === other.value;
    }

    isTool(): boolean {
        return this.value === WarehouseItemTypeEnum.TOOL;
    }

    isEquipment(): boolean {
        return this.value === WarehouseItemTypeEnum.EQUIPMENT;
    }

    isConsumable(): boolean {
        return this.value === WarehouseItemTypeEnum.CONSUMABLE;
    }
}