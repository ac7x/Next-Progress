/**
 * 倉庫物品數量值物件 - 確保數量符合業務規則
 */
export class WarehouseItemQuantity {
    private readonly value: number;

    constructor(value: number) {
        if (value < 0) {
            throw new Error('物品數量不能為負數');
        }

        this.value = Math.floor(value); // 確保數量為整數
    }

    getValue(): number {
        return this.value;
    }

    equals(other: WarehouseItemQuantity): boolean {
        return this.value === other.value;
    }

    isLowStock(threshold: number = 5): boolean {
        return this.value <= threshold;
    }

    isOutOfStock(): boolean {
        return this.value <= 0;
    }

    add(quantity: number): WarehouseItemQuantity {
        if (quantity < 0) {
            throw new Error('增加的數量不能為負數');
        }
        return new WarehouseItemQuantity(this.value + quantity);
    }

    subtract(quantity: number): WarehouseItemQuantity {
        if (quantity < 0) {
            throw new Error('減少的數量不能為負數');
        }
        if (this.value - quantity < 0) {
            throw new Error('庫存不足');
        }
        return new WarehouseItemQuantity(this.value - quantity);
    }
}