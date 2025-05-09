/**
 * 子任務實體狀態類型
 * 'TODO': 待處理
 * 'IN_PROGRESS': 進行中
 * 'DONE': 已完成
 */
export type SubTaskInstanceStatusType = 'TODO' | 'IN_PROGRESS' | 'DONE';

/**
 * 子任務實體狀態值物件
 * 負責驗證和封裝子任務實體狀態
 */
export class SubTaskInstanceStatus {
    private readonly value: SubTaskInstanceStatusType;

    /**
     * 建構子任務實體狀態值物件
     * @param value 狀態值，必須為有效的子任務狀態類型
     */
    constructor(value: SubTaskInstanceStatusType) {
        const validStatuses: SubTaskInstanceStatusType[] = ['TODO', 'IN_PROGRESS', 'DONE'];
        if (!validStatuses.includes(value)) {
            throw new Error(`無效的子任務實體狀態: ${value}`);
        }
        this.value = value;
    }

    /**
     * 獲取子任務實體狀態值
     */
    getValue(): SubTaskInstanceStatusType {
        return this.value;
    }

    /**
     * 判斷是否為待處理狀態
     */
    isTodo(): boolean {
        return this.value === 'TODO';
    }

    /**
     * 判斷是否為進行中狀態
     */
    isInProgress(): boolean {
        return this.value === 'IN_PROGRESS';
    }

    /**
     * 判斷是否為已完成狀態
     */
    isDone(): boolean {
        return this.value === 'DONE';
    }
}