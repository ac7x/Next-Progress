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
        if (isNaN(quantity)) {
            throw new Error('物品數量必須是數字');
        }

        if (quantity < 0) {
            throw new Error('物品數量不能為負數');
        }

        if (!Number.isInteger(quantity)) {
            throw new Error('物品數量必須是整數');
        }

        if (quantity > 1000000) {
            throw new Error('物品數量不能超過1,000,000');
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
        return new WarehouseItemQuantity(this.value + amount);
    }

    /**
     * 減少數量
     * @param amount 減少的數量
     */
    subtract(amount: number): WarehouseItemQuantity {
        return new WarehouseItemQuantity(this.value - amount);
    }

    /**
     * 判斷是否有庫存
     */
    hasStock(): boolean {
        return this.value > 0;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value.toString();
    }
}