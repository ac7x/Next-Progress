/**
 * 倉庫物品描述值物件 - 處理物品描述的有效性
 */
export class WarehouseItemDescription {
    private readonly value: string | null;

    constructor(value: string | null) {
        if (value && value.length > 500) {
            throw new Error('物品描述長度不能超過 500 字元');
        }
        this.value = value ? value.trim() : null;
    }

    getValue(): string | null {
        return this.value;
    }

    equals(other: WarehouseItemDescription): boolean {
        return this.value === other.value;
    }
}