/**
 * 倉庫描述值物件 - 處理倉庫描述的有效性
 */
export class WarehouseDescription {
    private readonly value: string | null;

    constructor(value: string | null) {
        if (value && value.length > 500) {
            throw new Error('倉庫描述長度不能超過 500 字元');
        }
        this.value = value ? value.trim() : null;
    }

    getValue(): string | null {
        return this.value;
    }

    equals(other: WarehouseDescription): boolean {
        return this.value === other.value;
    }
}