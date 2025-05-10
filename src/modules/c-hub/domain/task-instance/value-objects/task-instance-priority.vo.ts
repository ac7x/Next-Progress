export type TaskInstancePriorityName = 'HIGH' | 'MEDIUM' | 'LOW';

export class TaskInstancePriority {
    private readonly value: number;
    private static readonly MIN_VALUE = 0;
    private static readonly MAX_VALUE = 9;

    /**
     * 任務優先級常量
     * 數值越小優先級越高
     */
    static readonly HIGH = 0;
    static readonly MEDIUM = 1;
    static readonly LOW = 2;

    constructor(value: number | null | undefined) {
        const numberValue = value ?? TaskInstancePriority.MEDIUM;

        if (numberValue < TaskInstancePriority.MIN_VALUE) {
            throw new Error(`任務優先級不能小於 ${TaskInstancePriority.MIN_VALUE}`);
        }

        if (numberValue > TaskInstancePriority.MAX_VALUE) {
            throw new Error(`任務優先級不能大於 ${TaskInstancePriority.MAX_VALUE}`);
        }

        this.value = numberValue;
    }

    getValue(): number {
        return this.value;
    }

    /**
     * 根據優先級名稱創建優先級值物件
     * @param priorityName 優先級名稱
     * @returns 優先級值物件
     */
    static fromName(priorityName?: TaskInstancePriorityName): TaskInstancePriority {
        if (!priorityName) return new TaskInstancePriority(TaskInstancePriority.MEDIUM);
        
        switch(priorityName) {
            case 'HIGH':
                return new TaskInstancePriority(TaskInstancePriority.HIGH);
            case 'LOW':
                return new TaskInstancePriority(TaskInstancePriority.LOW);
            default:
                return new TaskInstancePriority(TaskInstancePriority.MEDIUM);
        }
    }

    /**
     * 獲取優先級名稱
     * @returns 優先級名稱
     */
    getName(): TaskInstancePriorityName {
        if (this.value === 0) return 'HIGH';
        if (this.value === 2) return 'LOW';
        return 'MEDIUM';
    }

    /**
     * 取得優先級的顯示文本描述
     */
    getDisplayText(): string {
        if (this.value <= TaskInstancePriority.HIGH) return '高';
        if (this.value <= TaskInstancePriority.MEDIUM) return '中';
        return '低';
    }
}