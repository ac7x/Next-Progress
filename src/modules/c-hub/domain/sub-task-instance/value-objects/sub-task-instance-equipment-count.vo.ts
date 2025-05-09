/**
 * 子任務實體設備數量值物件
 * 負責驗證和封裝子任務實體設備數量
 */
export class SubTaskInstanceEquipmentCount {
    private readonly value: number | null;

    /**
     * 建構子任務實體設備數量值物件
     * @param value 設備數量，可為 null 或必須是非負數
     */
    constructor(value: number | null) {
        if (value !== null && value < 0) {
            throw new Error('子任務實體設備數量不可為負數');
        }

        this.value = value;
    }

    /**
     * 獲取子任務實體設備數量值
     */
    getValue(): number | null {
        return this.value;
    }

    /**
     * 判斷是否有設備數量
     */
    hasValue(): boolean {
        return this.value !== null && this.value !== undefined;
    }

    /**
     * 判斷數量是否為零
     */
    isZero(): boolean {
        return this.value === 0;
    }
}