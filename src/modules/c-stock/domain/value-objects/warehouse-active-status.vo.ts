/**
 * 倉庫啟用狀態值物件 - 處理倉庫是否啟用的狀態
 */
export class WarehouseActiveStatus {
    private readonly value: boolean;

    constructor(value: boolean = true) {
        this.value = value;
    }

    getValue(): boolean {
        return this.value;
    }

    equals(other: WarehouseActiveStatus): boolean {
        return this.value === other.value;
    }

    isActive(): boolean {
        return this.value;
    }
}