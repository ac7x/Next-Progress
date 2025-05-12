/**
 * 倉庫相關值物件集合
 */

/**
 * 倉庫活動狀態值物件 - 封裝活動狀態的業務規則
 */
export class WarehouseActiveStatus {
    private readonly value: boolean;

    constructor(isActive: boolean) {
        this.value = isActive;
    }

    /**
     * 獲取活動狀態值
     */
    getValue(): boolean {
        return this.value;
    }

    /**
     * 檢查倉庫是否處於活動狀態
     */
    isActive(): boolean {
        return this.value;
    }

    /**
     * 比較兩個倉庫活動狀態是否相等
     * @param other 另一個倉庫活動狀態
     */
    equals(other: WarehouseActiveStatus): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value ? '活動' : '非活動';
    }
}

/**
 * 倉庫描述值物件 - 封裝描述的業務規則和驗證邏輯
 */
export class WarehouseDescription {
    private readonly value: string | null;

    constructor(description: string | null) {
        this.validate(description);
        this.value = description;
    }

    /**
     * 驗證倉庫描述
     * @param description 待驗證的描述
     */
    private validate(description: string | null): void {
        // 驗證邏輯
        if (description && description.length > 500) {
            throw new Error('倉庫描述不能超過500個字符');
        }
    }

    /**
     * 獲取描述值
     */
    getValue(): string | null {
        return this.value;
    }

    /**
     * 比較兩個倉庫描述是否相等
     * @param other 另一個倉庫描述
     */
    equals(other: WarehouseDescription): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value || '無描述';
    }
}

/**
 * 倉庫位置值物件 - 封裝位置的業務規則和驗證邏輯
 */
export class WarehouseLocation {
    private readonly value: string | null;

    constructor(location: string | null) {
        this.validate(location);
        this.value = location;
    }

    /**
     * 驗證倉庫位置
     * @param location 待驗證的位置
     */
    private validate(location: string | null): void {
        if (location && location.length > 200) {
            throw new Error('倉庫位置不能超過200個字符');
        }
    }

    /**
     * 獲取位置值
     */
    getValue(): string | null {
        return this.value;
    }

    /**
     * 比較兩個倉庫位置是否相等
     * @param other 另一個倉庫位置
     */
    equals(other: WarehouseLocation): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value || '無位置信息';
    }
}

/**
 * 倉庫名稱值物件 - 封裝名稱的業務規則和驗證邏輯
 */
export class WarehouseName {
    private readonly value: string;

    constructor(name: string) {
        this.validate(name);
        this.value = name;
    }

    /**
     * 驗證倉庫名稱
     * @param name 待驗證的名稱
     */
    private validate(name: string): void {
        if (!name || name.trim() === '') {
            throw new Error('倉庫名稱不能為空');
        }

        if (name.length < 2) {
            throw new Error('倉庫名稱長度不能少於2個字符');
        }

        if (name.length > 50) {
            throw new Error('倉庫名稱長度不能超過50個字符');
        }
    }

    /**
     * 獲取名稱值
     */
    getValue(): string {
        return this.value;
    }

    /**
     * 比較兩個倉庫名稱是否相等
     * @param other 另一個倉庫名稱
     */
    equals(other: WarehouseName): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value;
    }
}

/**
 * 倉庫物品相關值物件集合
 */

/**
 * 倉庫物品類型枚舉 - 定義物品的基本類型
 */
export enum WarehouseItemTypeEnum {
    TOOL = 'TOOL',
    EQUIPMENT = 'EQUIPMENT',
    CONSUMABLE = 'CONSUMABLE'
}

/**
 * 倉庫物品描述值物件 - 封裝物品描述的業務規則和驗證邏輯
 */
export class WarehouseItemDescription {
    private readonly value: string | null;

    constructor(description: string | null) {
        this.validate(description);
        this.value = description;
    }

    /**
     * 驗證倉庫物品描述
     * @param description 待驗證的描述
     */
    private validate(description: string | null): void {
        // 驗證邏輯
        if (description && description.length > 1000) {
            throw new Error('物品描述不能超過1000個字符');
        }
    }

    /**
     * 獲取描述值
     */
    getValue(): string | null {
        return this.value;
    }

    /**
     * 比較兩個物品描述是否相等
     * @param other 另一個物品描述
     */
    equals(other: WarehouseItemDescription): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value || '無描述';
    }
}

/**
 * 倉庫物品名稱值物件 - 封裝物品名稱的業務規則和驗證邏輯
 */
export class WarehouseItemName {
    private readonly value: string;

    constructor(name: string) {
        this.validate(name);
        this.value = name;
    }

    /**
     * 驗證倉庫物品名稱
     * @param name 待驗證的名稱
     */
    private validate(name: string): void {
        if (!name || name.trim() === '') {
            throw new Error('物品名稱不能為空');
        }

        if (name.length < 1) {
            throw new Error('物品名稱長度不能少於1個字符');
        }
    }

    /**
     * 獲取名稱值
     */
    getValue(): string {
        return this.value;
    }

    /**
     * 比較兩個物品名稱是否相等
     * @param other 另一個物品名稱
     */
    equals(other: WarehouseItemName): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value;
    }
}

/**
 * 倉庫物品數量值物件 - 封裝物品數量的業務規則和驗證邏輯
 */
export class WarehouseItemQuantity {
    private readonly value: number;

    constructor(quantity: number) {
        this.validate(quantity);
        this.value = quantity;
    }

    /**
     * 驗證倉庫物品數量
     * @param quantity 待驗證的數量
     */
    private validate(quantity: number): void {
        if (quantity < 0) {
            throw new Error('物品數量不能為負數');
        }

        if (!Number.isInteger(quantity)) {
            throw new Error('物品數量必須為整數');
        }
    }

    /**
     * 獲取數量值
     */
    getValue(): number {
        return this.value;
    }

    /**
     * 比較兩個物品數量是否相等
     * @param other 另一個物品數量
     */
    equals(other: WarehouseItemQuantity): boolean {
        return this.value === other.value;
    }

    /**
     * 增加數量
     * @param amount 增加的數量
     */
    add(amount: number): WarehouseItemQuantity {
        if (amount < 0) {
            throw new Error('增加的數量不能為負數');
        }
        return new WarehouseItemQuantity(this.value + amount);
    }

    /**
     * 減少數量
     * @param amount 減少的數量
     */
    subtract(amount: number): WarehouseItemQuantity {
        if (amount < 0) {
            throw new Error('減少的數量不能為負數');
        }
        if (this.value < amount) {
            throw new Error('庫存不足，無法減少該數量');
        }
        return new WarehouseItemQuantity(this.value - amount);
    }
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
        const validTypes = Object.values(WarehouseItemTypeEnum);
        if (!validTypes.includes(type as any)) {
            throw new Error(`無效的物品類型。有效類型為: ${validTypes.join(', ')}`);
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
}

