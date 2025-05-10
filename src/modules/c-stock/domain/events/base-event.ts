/**
 * 領域事件基礎類別 - 所有領域事件皆繼承此類
 */
export abstract class DomainEvent {
    /**
     * 事件發生時間
     */
    readonly occurredAt: Date;

    /**
     * 事件唯一識別碼
     */
    readonly eventId: string;

    constructor() {
        this.occurredAt = new Date();
        this.eventId = this.generateId();
    }

    /**
     * 生成唯一事件 ID
     */
    private generateId(): string {
        return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    }
}