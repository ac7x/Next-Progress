/**
 * 倉庫名稱值物件 - 封裝名稱的業務規則和驗證邏輯
 */
export class WarehouseName {
    private readonly value: string;

    constructor(name: string) {
        this.validate(name);
        this.value = name;
    }

    /**
     * 驗證倉庫名稱
     * @param name 待驗證的名稱
     */
    private validate(name: string): void {
        if (!name || name.trim() === '') {
            throw new Error('倉庫名稱不能為空');
        }

        if (name.length < 2) {
            throw new Error('倉庫名稱至少需要2個字符');
        }

        if (name.length > 50) {
            throw new Error('倉庫名稱不能超過50個字符');
        }
    }

    /**
     * 獲取名稱值
     */
    getValue(): string {
        return this.value;
    }

    /**
     * 比較兩個倉庫名稱是否相等
     * @param other 另一個倉庫名稱
     */
    equals(other: WarehouseName): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value;
    }
}