import { DomainEvent } from './base-event';

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