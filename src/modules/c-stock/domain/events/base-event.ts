/**
 * 領域事件基類 - 所有領域事件的基礎
 */
export abstract class DomainEvent {
    public readonly occurredOn: Date;

    constructor() {
        this.occurredOn = new Date();
    }
}