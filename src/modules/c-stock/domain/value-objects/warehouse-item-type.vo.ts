/**
 * 倉庫物品類型 - 枚舉定義
 */
export enum WarehouseItemTypeEnum {
    TOOL = 'TOOL',
    EQUIPMENT = 'EQUIPMENT',
    CONSUMABLE = 'CONSUMABLE',
}

/**
 * 倉庫物品類型值物件 - 確保物品類型符合業務規則
 */
export class WarehouseItemType {
    private readonly value: WarehouseItemTypeEnum;

    constructor(value: string | WarehouseItemTypeEnum) {
        if (!Object.values(WarehouseItemTypeEnum).includes(value as WarehouseItemTypeEnum)) {
            throw new Error(`無效的物品類型：${value}`);
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