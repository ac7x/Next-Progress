/**
 * 倉庫活動狀態值物件 - 封裝活動狀態的業務規則
 */
export class WarehouseActiveStatus {
    private readonly value: boolean;

    constructor(isActive: boolean) {
        this.value = isActive;
    }

    /**
     * 獲取活動狀態值
     */
    getValue(): boolean {
        return this.value;
    }

    /**
     * 檢查倉庫是否處於活動狀態
     */
    isActive(): boolean {
        return this.value;
    }

    /**
     * 比較兩個倉庫活動狀態是否相等
     * @param other 另一個倉庫活動狀態
     */
    equals(other: WarehouseActiveStatus): boolean {
        return this.value === other.value;
    }

    /**
     * 轉換為字符串表示
     */
    toString(): string {
        return this.value ? '活動' : '非活動';
    }
}