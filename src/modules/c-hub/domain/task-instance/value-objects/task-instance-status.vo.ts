export type TaskInstanceStatusType = 'TODO' | 'IN_PROGRESS' | 'DONE';

export class TaskInstanceStatus {
    private readonly value: TaskInstanceStatusType;

    // 靜態狀態常量，便於使用
    static readonly TODO: TaskInstanceStatusType = 'TODO';
    static readonly IN_PROGRESS: TaskInstanceStatusType = 'IN_PROGRESS';
    static readonly DONE: TaskInstanceStatusType = 'DONE';

    constructor(value: string) {
        // 檢查狀態是否有效
        if (!this.isValidStatus(value)) {
            throw new Error(`無效的任務實例狀態: ${value}，有效值為: TODO, IN_PROGRESS, DONE`);
        }
        this.value = value as TaskInstanceStatusType;
    }

    getValue(): TaskInstanceStatusType {
        return this.value;
    }

    // 檢查是否為有效狀態值
    private isValidStatus(value: string): boolean {
        return ['TODO', 'IN_PROGRESS', 'DONE'].includes(value);
    }

    // 狀態檢查方法
    isTodo(): boolean {
        return this.value === 'TODO';
    }

    isInProgress(): boolean {
        return this.value === 'IN_PROGRESS';
    }

    isDone(): boolean {
        return this.value === 'DONE';
    }

    // 狀態可以轉換為顯示文字
    getDisplayText(): string {
        const displayTextMap = {
            'TODO': '待處理',
            'IN_PROGRESS': '進行中',
            'DONE': '已完成'
        };
        return displayTextMap[this.value];
    }
}