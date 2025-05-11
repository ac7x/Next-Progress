/**
 * 任務模板數量值物件
 * 負責處理任務模板數量相關的業務規則與約束
 */
export class TaskTemplateCount {
    private readonly value: number;
    private static readonly MIN_VALUE = 1;
    private static readonly MAX_VALUE = 9999;
    private static readonly DEFAULT_VALUE = 1;

    /**
     * 建構函數 - 驗證並封裝任務模板數量
     * @param count 任務模板數量
     * @throws 如果數量不符合業務規則，將拋出錯誤
     */
    private constructor(count: number | null | undefined) {
        const validCount = this.validateAndNormalize(count);
        this.value = validCount;
    }

    /**
     * 靜態工廠方法 - 建立任務模板數量值物件
     * @param count 任務模板數量，可為null或undefined
     * @returns 任務模板數量值物件實例
     */
    public static create(count: number | null | undefined): TaskTemplateCount {
        return new TaskTemplateCount(count);
    }

    /**
     * 獲取任務模板數量值
     * @returns 任務模板數量數值
     */
    getValue(): number {
        return this.value;
    }

    /**
     * 驗證任務模板數量是否符合業務規則，並標準化輸入值
     * @param count 待驗證的任務模板數量
     * @returns 標準化後的數量值
     * @throws 如果數量不符合規則，將拋出對應錯誤
     */
    private validateAndNormalize(count: number | null | undefined): number {
        // 如果數量為null或undefined，則返回默認值
        if (count === null || count === undefined) {
            return TaskTemplateCount.DEFAULT_VALUE;
        }

        // 將輸入轉換為整數
        const countNum = Math.floor(count);

        // 驗證數量範圍
        if (countNum < TaskTemplateCount.MIN_VALUE) {
            throw new Error(`任務模板數量不能小於${TaskTemplateCount.MIN_VALUE}`);
        }

        if (countNum > TaskTemplateCount.MAX_VALUE) {
            throw new Error(`任務模板數量不能大於${TaskTemplateCount.MAX_VALUE}`);
        }

        return countNum;
    }

    /**
     * 比較兩個任務模板數量值物件是否相等
     * @param other 另一個任務模板數量值物件
     * @returns 如果兩個值物件包含相同的值，則返回true
     */
    equals(other: TaskTemplateCount): boolean {
        return this.value === other.value;
    }

    /**
     * 判斷當前數量是否大於指定數量
     * @param other 另一個任務模板數量值物件
     * @returns 如果當前數量大於指定數量，則返回true
     */
    greaterThan(other: TaskTemplateCount): boolean {
        return this.value > other.value;
    }

    /**
     * 判斷當前數量是否小於指定數量
     * @param other 另一個任務模板數量值物件
     * @returns 如果當前數量小於指定數量，則返回true
     */
    lessThan(other: TaskTemplateCount): boolean {
        return this.value < other.value;
    }
}