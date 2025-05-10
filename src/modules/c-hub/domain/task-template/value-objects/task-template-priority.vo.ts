/**
 * 任務模板優先級值物件
 * 負責處理優先級相關的業務規則與約束
 */
export class TaskTemplatePriority {
    private readonly value: number;
    private static readonly MIN_VALUE = 0; // 高優先級
    private static readonly MAX_VALUE = 2; // 低優先級

    constructor(priority: number | null | undefined) {
        // 設置預設值
        if (priority === null || priority === undefined) {
            this.value = 0; // 預設為高優先級
            return;
        }

        // 驗證規則
        const priorityValue = Number(priority);
        if (isNaN(priorityValue)) {
            throw new Error('任務模板優先級必須為數字');
        }

        if (priorityValue < TaskTemplatePriority.MIN_VALUE || priorityValue > TaskTemplatePriority.MAX_VALUE) {
            throw new Error(`任務模板優先級必須在 ${TaskTemplatePriority.MIN_VALUE} 至 ${TaskTemplatePriority.MAX_VALUE} 之間`);
        }

        this.value = priorityValue;
    }

    /**
     * 獲取優先級值
     */
    getValue(): number {
        return this.value;
    }

    /**
     * 獲取優先級文字描述
     */
    getLabel(): string {
        switch (this.value) {
            case 0:
                return '高';
            case 1:
                return '中';
            case 2:
                return '低';
            default:
                return '未知';
        }
    }

    /**
     * 比較兩個優先級值物件是否相等
     */
    equals(other: TaskTemplatePriority): boolean {
        return this.value === other.value;
    }

    /**
     * 比較優先級高低
     * @returns 負數表示比對象更高優先級，正數表示比對象更低優先級，0表示相同
     */
    compareTo(other: TaskTemplatePriority): number {
        return this.value - other.value;
    }

    /**
     * 是否為高優先級
     */
    isHigh(): boolean {
        return this.value === 0;
    }

    /**
     * 是否為中優先級
     */
    isMedium(): boolean {
        return this.value === 1;
    }

    /**
     * 是否為低優先級
     */
    isLow(): boolean {
        return this.value === 2;
    }
}