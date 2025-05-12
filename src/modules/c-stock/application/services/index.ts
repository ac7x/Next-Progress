import { warehouseItemRepository } from '../../infrastructure/repositories';
import { WarehouseInstanceRepository } from '../../infrastructure/repositories';
import { WarehouseApplicationService, WarehouseItemApplicationService } from './warehouse.services';

// 初始化服務實例
const warehouseRepository = new WarehouseInstanceRepository();
const warehouseApplicationService = new WarehouseApplicationService(warehouseRepository);
const warehouseItemApplicationService = new WarehouseItemApplicationService(
    warehouseItemRepository,
    warehouseRepository
);

export const warehouseService = warehouseApplicationService;
export const warehouseItemService = warehouseItemApplicationService;

export * from './warehouse.services';

