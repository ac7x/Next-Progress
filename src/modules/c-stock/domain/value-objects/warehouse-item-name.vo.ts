/**
 * 倉庫物品名稱值物件 - 確保物品名稱符合業務規則
 */
export class WarehouseItemName {
    private readonly value: string;

    constructor(value: string) {
        if (!value || !value.trim()) {
            throw new Error('物品名稱不能為空');
        }
        if (value.length > 100) {
            throw new Error('物品名稱長度不能超過 100 字元');
        }
        this.value = value.trim();
    }

    getValue(): string {
        return this.value;
    }

    equals(other: WarehouseItemName): boolean {
        return this.value === other.value;
    }
}