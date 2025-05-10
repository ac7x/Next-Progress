import { DomainEvent } from './base-event';

/**
 * 倉庫刪除事件 - 當倉庫被刪除時觸發
 */
export class WarehouseDeletedEvent extends DomainEvent {
    constructor(public readonly warehouseId: string) {
        super();
    }
}