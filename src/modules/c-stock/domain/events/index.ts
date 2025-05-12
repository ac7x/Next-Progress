import { Warehouse } from '../entities/warehouse.entity';
import { WarehouseItem } from '../entities/warehouse.item.entity';

/**
 * 領域事件基類 - 所有領域事件的基礎
 */
export abstract class DomainEvent {
    public readonly occurredOn: Date;

    constructor() {
        this.occurredOn = new Date();
    }
}

/**
 * 倉庫創建事件 - 當新倉庫創建時觸發
 */
export class WarehouseCreatedEvent extends DomainEvent {
    constructor(public readonly warehouse: Warehouse) {
        super();
    }
}

/**
 * 倉庫刪除事件 - 當倉庫被刪除時觸發
 */
export class WarehouseDeletedEvent extends DomainEvent {
    constructor(public readonly warehouseId: string) {
        super();
    }
}

/**
 * 倉庫更新事件 - 當倉庫資訊被更新時觸發
 */
export class WarehouseUpdatedEvent extends DomainEvent {
    constructor(
        public readonly warehouse: Warehouse,
        public readonly previousValues: Partial<Warehouse>
    ) {
        super();
    }
}

/**
 * 倉庫物品創建事件 - 當新物品被添加到倉庫時觸發
 */
export class WarehouseItemCreatedEvent extends DomainEvent {
    constructor(public readonly item: WarehouseItem) {
        super();
    }
}

/**
 * 倉庫物品刪除事件 - 當物品從倉庫中移除時觸發
 */
export class WarehouseItemDeletedEvent extends DomainEvent {
    constructor(
        public readonly itemId: string,
        public readonly warehouseId: string
    ) {
        super();
    }
}

/**
 * 倉庫物品更新事件 - 當物品信息被更新時觸發
 */
export class WarehouseItemUpdatedEvent extends DomainEvent {
    constructor(
        public readonly item: WarehouseItem,
        public readonly previousValues: Partial<WarehouseItem>
    ) {
        super();
    }
}

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

    /**
     * 發布領域事件
     * @param event 領域事件
     */
    publish<T extends DomainEvent>(event: T): void {
        // 實現發布邏輯
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
        // 實現訂閱邏輯
    }
}

// 導出單例實例
export const domainEventPublisher = new SimpleDomainEventPublisher();
