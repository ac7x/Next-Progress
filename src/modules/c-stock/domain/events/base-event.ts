/**
 * 領域事件基礎類
 */
export abstract class DomainEvent {
    readonly eventId: string;
    readonly occurredOn: Date;

    constructor() {
        this.eventId = crypto.randomUUID();
        this.occurredOn = new Date();
    }
}