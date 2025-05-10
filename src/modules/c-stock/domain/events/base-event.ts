/**
 * 領域事件基礎類 - 所有領域事件的父類
 */
export abstract class DomainEvent {
    public readonly occurredAt: Date;
    public readonly eventId: string;

    constructor() {
        this.occurredAt = new Date();
        this.eventId = crypto.randomUUID();
    }
}