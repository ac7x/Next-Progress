export class TaskInstanceEquipmentCount {
    private readonly value: number | null;
    private static readonly MIN_VALUE = 0;

    constructor(value: number | null | undefined) {
        // 若為空值則直接設為 null
        if (value === null || value === undefined) {
            this.value = null;
            return;
        }

        // 檢查是否為非負數
        if (value < TaskInstanceEquipmentCount.MIN_VALUE) {
            throw new Error(`設備數量不能小於 ${TaskInstanceEquipmentCount.MIN_VALUE}`);
        }

        // 轉為整數
        this.value = Math.round(value);
    }

    getValue(): number | null {
        return this.value;
    }

    /**
     * 檢查是否已設置設備數量
     */
    isSet(): boolean {
        return this.value !== null;
    }

    /**
     * 計算完成率 (基於實際完成數量)
     * @param actualCount 實際完成的設備數量
     */
    calculateCompletionRate(actualCount: number | null): number {
        if (this.value === null || this.value === 0 || actualCount === null) {
            return 0;
        }

        let rate = Math.round((actualCount / this.value) * 100);
        return Math.min(Math.max(rate, 0), 100); // 確保在 0-100% 範圍內
    }
}