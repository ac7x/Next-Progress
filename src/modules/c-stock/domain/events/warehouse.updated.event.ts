import { Warehouse } from '../entities/warehouse.entity';
import { DomainEvent } from './warehouse.base.event';

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