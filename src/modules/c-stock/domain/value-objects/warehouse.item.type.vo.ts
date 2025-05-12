/**
 * 倉庫物品類型枚舉 - 定義物品的基本類型
 */
export enum WarehouseItemTypeEnum {
    TOOL = 'TOOL',           // 工具
    EQUIPMENT = 'EQUIPMENT', // 設備
    CONSUMABLE = 'CONSUMABLE'  // 耗材
}

/**
 * 倉庫物品類型值物件 - 封裝物品類型的業務規則和驗證邏輯
 */
export class WarehouseItemType {
    private readonly value: string;

    constructor(type: string) {
        this.validate(type);
        this.value = type;
    }

    /**
     * 驗證倉庫物品類型
     * @param type 待驗證的類型
     */
    private validate(type: string): void {
        if (!type || type.trim() === '') {
            throw new Error('物品類型不能為空');
        }

        // 驗證類型是否為有效的枚舉值
        const validTypes = Object.values(WarehouseItemTypeEnum);
        if (!validTypes.includes(type as WarehouseItemTypeEnum)) {
            throw new Error(`無效的物品類型: ${type}。有效類型為: ${validTypes.join(', ')}`);
        }
    }

    /**
     * 獲取類型值
     */
    getValue(): string {
        return this.value;
    }

    /**
     * 比較兩個物品類型是否相等
     * @param other 另一個物品類型
     */
    equals(other: WarehouseItemType): boolean {
        return this.value === other.value;
    }

    /**
     * 檢查是否為工具類型
     */
    isTool(): boolean {
        return this.value === WarehouseItemTypeEnum.TOOL;
    }

    /**
     * 檢查是否為設備類型
     */
    isEquipment(): boolean {
        return this.value === WarehouseItemTypeEnum.EQUIPMENT;
    }

    /**
     * 檢查是否為耗材類型
     */
    isConsumable(): boolean {
        return this.value === WarehouseItemTypeEnum.CONSUMABLE;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value;
    }

    /**
     * 取得類型的中文名稱
     */
    getLocalizedName(): string {
        const names = {
            [WarehouseItemTypeEnum.TOOL]: '工具',
            [WarehouseItemTypeEnum.EQUIPMENT]: '設備',
            [WarehouseItemTypeEnum.CONSUMABLE]: '耗材'
        };

        return names[this.value as WarehouseItemTypeEnum] || this.value;
    }
}