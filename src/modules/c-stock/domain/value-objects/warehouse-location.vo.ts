/**
 * 倉庫位置值物件 - 確保倉庫位置符合業務規則
 */
export class WarehouseLocation {
    private readonly value: string | null;

    constructor(value: string | null) {
        if (value && value.length > 200) {
            throw new Error('倉庫位置長度不能超過 200 字元');
        }
        this.value = value ? value.trim() : null;
    }

    getValue(): string | null {
        return this.value;
    }

    equals(other: WarehouseLocation): boolean {
        return this.value === other.value;
    }
}