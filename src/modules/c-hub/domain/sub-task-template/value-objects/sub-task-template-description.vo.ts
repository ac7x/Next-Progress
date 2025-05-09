export class SubTaskTemplateDescription {
    private readonly value: string | null;
    private static readonly MAX_LENGTH = 1000;

    constructor(value: string | null) {
        // 允許 null 或空字串，但有內容時需檢查長度
        if (value !== null && value !== undefined && value.trim() !== '') {
            if (value.length > SubTaskTemplateDescription.MAX_LENGTH) {
                throw new Error(`子任務模板描述不能超過 ${SubTaskTemplateDescription.MAX_LENGTH} 字元`);
            }
            this.value = value.trim();
        } else {
            this.value = null;
        }
    }

    getValue(): string | null {
        return this.value;
    }

    // 檢查是否有描述內容
    hasValue(): boolean {
        return this.value !== null && this.value.trim() !== '';
    }

    // 獲取顯示用的描述文字，如沒有則返回預設值
    getDisplayText(defaultText: string = '無描述'): string {
        return this.hasValue() ? this.value! : defaultText;
    }
}