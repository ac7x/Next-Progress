import { WarehouseItem } from '../entities/warehouse-item-entity';
import { DomainEvent } from './base-event';

/**
 * 倉庫物品創建事件 - 當新物品被添加到倉庫時觸發
 */
export class WarehouseItemCreatedEvent extends DomainEvent {
    constructor(public readonly item: WarehouseItem) {
        super();
    }
}