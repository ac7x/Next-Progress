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
        return this.value || '';
    }
}