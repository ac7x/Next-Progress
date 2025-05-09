export class SubTaskTemplateEquipmentCount {
    private readonly value: number | null;

    constructor(value: number | null) {
        // 允許 null 值，但如果有值則必須是非負整數
        if (value !== null && value !== undefined) {
            if (value < 0 || !Number.isInteger(value)) {
                throw new Error('子任務模板設備數量必須是非負整數');
            }
            this.value = value;
        } else {
            this.value = null;
        }
    }

    getValue(): number | null {
        return this.value;
    }

    // 檢查是否有設備數量
    hasValue(): boolean {
        return this.value !== null && this.value >= 0;
    }

    // 檢查設備數量是否為零
    isZero(): boolean {
        return this.value === 0;
    }

    // 獲取顯示用的設備數量文字
    getDisplayText(defaultText: string = '未指定'): string {
        return this.hasValue() ? this.value!.toString() : defaultText;
    }
}