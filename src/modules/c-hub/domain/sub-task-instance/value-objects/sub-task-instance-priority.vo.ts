/**
 * 子任務實體優先級值物件
 * 負責驗證和封裝子任務實體優先級
 */
export class SubTaskInstancePriority {
    private readonly value: number;

    /**
     * 建構子任務實體優先級值物件
     * @param value 優先級值，必須是 0（高）、1（中）或 2（低）
     */
    constructor(value: number) {
        if (![0, 1, 2].includes(value)) {
            throw new Error('子任務實體優先級必須為 0（高）、1（中）、2（低）');
        }

        this.value = value;
    }

    /**
     * 獲取子任務實體優先級值
     */
    getValue(): number {
        return this.value;
    }
}