/**
 * 倉庫名稱值物件 - 確保倉庫名稱符合業務規則
 */
export class WarehouseName {
    private readonly value: string;

    constructor(value: string) {
        if (!value || !value.trim()) {
            throw new Error('倉庫名稱不能為空');
        }
        if (value.length > 100) {
            throw new Error('倉庫名稱長度不能超過 100 字元');
        }
        this.value = value.trim();
    }

    getValue(): string {
        return this.value;
    }

    equals(other: WarehouseName): boolean {
        return this.value === other.value;
    }
}