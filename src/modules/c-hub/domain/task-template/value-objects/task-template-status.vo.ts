/**
 * 任務模板狀態類型
 */
export type TaskTemplateStatusType = 'active' | 'inactive' | 'draft';

/**
 * 任務模板狀態值物件
 * 負責處理任務模板狀態相關的業務規則與約束
 */
export class TaskTemplateStatus {
    private readonly value: TaskTemplateStatusType;
    private static readonly VALID_STATUSES: TaskTemplateStatusType[] = ['active', 'inactive', 'draft'];

    constructor(status: TaskTemplateStatusType | string | null | undefined) {
        // 設置預設值
        if (!status) {
            this.value = 'active'; // 預設為啟用狀態
            return;
        }

        // 驗證規則
        if (!TaskTemplateStatus.VALID_STATUSES.includes(status as TaskTemplateStatusType)) {
            throw new Error(`無效的任務模板狀態: ${status}`);
        }

        this.value = status as TaskTemplateStatusType;
    }

    /**
     * 獲取狀態值
     */
    getValue(): TaskTemplateStatusType {
        return this.value;
    }

    /**
     * 獲取狀態文字描述
     */
    getLabel(): string {
        switch (this.value) {
            case 'active':
                return '啟用';
            case 'inactive':
                return '停用';
            case 'draft':
                return '草稿';
            default:
                return '未知';
        }
    }

    /**
     * 比較兩個狀態值物件是否相等
     */
    equals(other: TaskTemplateStatus): boolean {
        return this.value === other.value;
    }

    /**
     * 是否為啟用狀態
     */
    isActive(): boolean {
        return this.value === 'active';
    }

    /**
     * 是否為停用狀態
     */
    isInactive(): boolean {
        return this.value === 'inactive';
    }

    /**
     * 是否為草稿狀態
     */
    isDraft(): boolean {
        return this.value === 'draft';
    }
}