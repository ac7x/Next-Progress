import { warehouseItemRepository } from '../../infrastructure/repositories/warehouse.item.repository';
import { WarehouseInstanceRepository } from '../../infrastructure/repositories/warehouse.repository';
import { WarehouseItemApplicationService } from './warehouse.item.service';
import { WarehouseApplicationService } from './warehouse.service';

// 初始化服務實例
const warehouseRepository = new WarehouseInstanceRepository();
const warehouseApplicationService = new WarehouseApplicationService(warehouseRepository);
const warehouseItemApplicationService = new WarehouseItemApplicationService(
    warehouseItemRepository,
    warehouseRepository
);

export const warehouseService = warehouseApplicationService;
export const warehouseItemService = warehouseItemApplicationService;

export * from './warehouse.item.service';
export * from './warehouse.service';

