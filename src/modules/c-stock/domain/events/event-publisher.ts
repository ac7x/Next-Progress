import { DomainEvent } from './base-event';

/**
 * 領域事件發布者介面 - 定義事件發布機制
 */
export interface IDomainEventPublisher {
    /**
     * 發布領域事件
     * @param event 領域事件
     */
    publish<T extends DomainEvent>(event: T): void;

    /**
     * 訂閱領域事件
     * @param eventType 事件類型
     * @param handler 事件處理函數
     */
    subscribe<T extends DomainEvent>(
        eventType: { new(...args: any[]): T },
        handler: (event: T) => void
    ): void;
}

/**
 * 簡單事件發布者實現 - 用於發布領域事件
 */
class SimpleDomainEventPublisher implements IDomainEventPublisher {
    private handlers = new Map<string, Array<(event: DomainEvent) => void>>();

    /**
     * 發布領域事件
     * @param event 領域事件
     */
    publish<T extends DomainEvent>(event: T): void {
        const eventName = event.constructor.name;
        console.log(`領域事件已觸發: ${eventName}`, event);

        if (this.handlers.has(eventName)) {
            this.handlers.get(eventName)?.forEach(handler => handler(event));
        }
    }

    /**
     * 訂閱領域事件
     * @param eventType 事件類型
     * @param handler 事件處理函數
     */
    subscribe<T extends DomainEvent>(
        eventType: { new(...args: any[]): T },
        handler: (event: T) => void
    ): void {
        const eventName = eventType.name;
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }

        this.handlers.get(eventName)?.push(handler as (event: DomainEvent) => void);
    }
}

// 導出單例實例
export const domainEventPublisher = new SimpleDomainEventPublisher();
