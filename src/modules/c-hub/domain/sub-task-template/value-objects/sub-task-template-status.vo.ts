export type SubTaskTemplateStatusType = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export class SubTaskTemplateStatus {
    private readonly value: SubTaskTemplateStatusType;

    // 靜態狀態常量，便於使用
    static readonly PENDING: SubTaskTemplateStatusType = 'pending';
    static readonly IN_PROGRESS: SubTaskTemplateStatusType = 'in-progress';
    static readonly COMPLETED: SubTaskTemplateStatusType = 'completed';
    static readonly CANCELLED: SubTaskTemplateStatusType = 'cancelled';

    constructor(value: string) {
        // 檢查狀態是否有效
        if (!this.isValidStatus(value)) {
            throw new Error(`無效的子任務模板狀態: ${value}，有效值為: pending, in-progress, completed, cancelled`);
        }
        this.value = value as SubTaskTemplateStatusType;
    }

    getValue(): SubTaskTemplateStatusType {
        return this.value;
    }

    // 檢查是否為有效狀態值
    private isValidStatus(value: string): boolean {
        return ['pending', 'in-progress', 'completed', 'cancelled'].includes(value);
    }

    // 狀態檢查方法
    isPending(): boolean {
        return this.value === 'pending';
    }

    isInProgress(): boolean {
        return this.value === 'in-progress';
    }

    isCompleted(): boolean {
        return this.value === 'completed';
    }

    isCancelled(): boolean {
        return this.value === 'cancelled';
    }

    // 狀態可以轉換為顯示文字
    getDisplayText(): string {
        const displayTextMap = {
            'pending': '待處理',
            'in-progress': '進行中',
            'completed': '已完成',
            'cancelled': '已取消'
        };
        return displayTextMap[this.value];
    }
}