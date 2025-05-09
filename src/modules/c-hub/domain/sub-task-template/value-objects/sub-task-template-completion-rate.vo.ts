export class SubTaskTemplateCompletionRate {
    private readonly value: number;

    constructor(value: number) {
        // 確保完成率介於 0-100%
        if (value < 0 || value > 100) {
            throw new Error('子任務模板完成率必須在 0-100% 之間');
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    // 檢查是否已完成
    isCompleted(): boolean {
        return this.value === 100;
    }

    // 檢查是否未開始
    isNotStarted(): boolean {
        return this.value === 0;
    }

    // 檢查是否進行中
    isInProgress(): boolean {
        return this.value > 0 && this.value < 100;
    }
}