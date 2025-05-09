export class SubTaskTemplateOrderIndex {
    private readonly value: number;

    constructor(value: number) {
        // 確保排序索引為非負整數
        if (value < 0 || !Number.isInteger(value)) {
            throw new Error('子任務模板排序索引必須是非負整數');
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    // 比較兩個排序索引的先後順序
    isBefore(other: SubTaskTemplateOrderIndex): boolean {
        return this.value < other.getValue();
    }

    isAfter(other: SubTaskTemplateOrderIndex): boolean {
        return this.value > other.getValue();
    }

    // 創建新的排序索引，用於插入到兩個排序索引之間
    static createBetween(
        before: SubTaskTemplateOrderIndex | null,
        after: SubTaskTemplateOrderIndex | null
    ): SubTaskTemplateOrderIndex {
        const beforeValue = before ? before.getValue() : 0;
        const afterValue = after ? after.getValue() : beforeValue + 1000; // 如果沒有after，給一個較大的間隔

        // 計算兩者之間的值
        const newValue = Math.floor((beforeValue + afterValue) / 2);
        return new SubTaskTemplateOrderIndex(newValue);
    }
}