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
            throw new Error('物品名稱至少需要1個字符');
        }

        if (name.length > 100) {
            throw new Error('物品名稱不能超過100個字符');
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