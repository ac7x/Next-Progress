/**
 * 任務模板名稱值物件
 * 負責處理名稱相關的業務規則與約束
 */
export class TaskTemplateName {
    private readonly value: string;
    private static readonly MIN_LENGTH = 1;
    private static readonly MAX_LENGTH = 255;

    constructor(name: string | null | undefined) {
        // 驗證規則
        if (!name || name.trim().length === 0) {
            throw new Error('任務模板名稱不能為空');
        }

        if (name.length > TaskTemplateName.MAX_LENGTH) {
            throw new Error(`任務模板名稱不能超過 ${TaskTemplateName.MAX_LENGTH} 個字符`);
        }

        this.value = name.trim();
    }

    /**
     * 獲取名稱值
     */
    getValue(): string {
        return this.value;
    }

    /**
     * 比較兩個名稱值物件是否相等
     */
    equals(other: TaskTemplateName): boolean {
        return this.value === other.value;
    }

    /**
     * 將值物件轉換為字符串表示
     */
    toString(): string {
        return this.value;
    }
}