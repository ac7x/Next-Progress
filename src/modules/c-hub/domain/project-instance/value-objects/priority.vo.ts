/**
 * Priority 值物件 - 表示系統中元素的優先級別
 * 0-9 共十個級別，其中 0 為最高優先級，9 為最低優先級
 */
export class Priority {
    private readonly value: number;
    static readonly MIN = 0; // 最高優先級
    static readonly MAX = 9; // 最低優先級

    private constructor(value: number) {
        // 確保值在合法範圍內
        if (value < Priority.MIN || value > Priority.MAX) {
            throw new Error(`Priority must be between ${Priority.MIN} and ${Priority.MAX}`);
        }
        this.value = value;
    }

    /**
     * 創建一個優先級值物件
     * @param value 優先級值 (0-9)
     */
    static create(value: number): Priority {
        return new Priority(value);
    }

    /**
     * 提高優先級 (數字減小)
     * @returns 新的優先級值物件
     */
    increment(): Priority {
        if (this.value <= Priority.MIN) {
            return this; // 已達最高優先級
        }
        return new Priority(this.value - 1);
    }

    /**
     * 降低優先級 (數字增大)
     * @returns 新的優先級值物件
     */
    decrement(): Priority {
        if (this.value >= Priority.MAX) {
            return this; // 已達最低優先級
        }
        return new Priority(this.value + 1);
    }

    /**
     * 獲取優先級數字值
     * @returns 優先級數值
     */
    getValue(): number {
        return this.value;
    }

    /**
     * 檢查是否為最高優先級
     */
    isHighest(): boolean {
        return this.value === Priority.MIN;
    }

    /**
     * 檢查是否為最低優先級
     */
    isLowest(): boolean {
        return this.value === Priority.MAX;
    }

    /**
     * 比較兩個優先級
     * @param other 另一個優先級值物件
     * @returns 如果當前優先級更高則為負數，相等則為0，更低則為正數
     */
    compareTo(other: Priority): number {
        return this.value - other.value;
    }
}