export class TaskInstanceCompletionRate {
    private readonly value: number;
    private static readonly MIN_VALUE = 0;
    private static readonly MAX_VALUE = 100;

    constructor(value: number | null | undefined) {
        const numberValue = value ?? 0;
        
        // 確保完成率在有效範圍內
        if (numberValue < TaskInstanceCompletionRate.MIN_VALUE) {
            throw new Error(`任務完成率不能小於 ${TaskInstanceCompletionRate.MIN_VALUE}%`);
        }

        if (numberValue > TaskInstanceCompletionRate.MAX_VALUE) {
            throw new Error(`任務完成率不能大於 ${TaskInstanceCompletionRate.MAX_VALUE}%`);
        }

        // 四捨五入到整數
        this.value = Math.round(numberValue);
    }

    getValue(): number {
        return this.value;
    }

    /**
     * 檢查是否已完成 (100%)
     */
    isComplete(): boolean {
        return this.value === TaskInstanceCompletionRate.MAX_VALUE;
    }

    /**
     * 檢查是否至少開始 (>0%)
     */
    isStarted(): boolean {
        return this.value > TaskInstanceCompletionRate.MIN_VALUE;
    }

    /**
     * 取得完成率的文字表示形式
     */
    getDisplayText(): string {
        return `${this.value}%`;
    }
}