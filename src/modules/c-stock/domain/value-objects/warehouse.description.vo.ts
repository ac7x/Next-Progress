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
        return this.value || '';
    }
}