import { WarehouseItem } from '../entities/warehouse-item-entity';
import { DomainEvent } from './base-event';

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