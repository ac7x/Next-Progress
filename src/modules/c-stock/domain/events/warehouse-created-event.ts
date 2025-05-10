import { Warehouse } from '../entities/warehouse-entity';
import { DomainEvent } from './base-event';

/**
 * 倉庫創建事件 - 當新倉庫創建時觸發
 */
export class WarehouseCreatedEvent extends DomainEvent {
    constructor(public readonly warehouse: Warehouse) {
        super();
    }
}