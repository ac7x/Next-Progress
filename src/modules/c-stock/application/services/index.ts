import { warehouseItemRepository } from '../../infrastructure/repositories/warehouse-item-repository';
import { warehouseRepository } from '../../infrastructure/repositories/warehouse-repository';
import { WarehouseItemApplicationService } from './warehouse-item-service';
import { WarehouseApplicationService } from './warehouse-service';

// 初始化服務實例
const warehouseApplicationService = new WarehouseApplicationService(warehouseRepository);
const warehouseItemApplicationService = new WarehouseItemApplicationService(
    warehouseItemRepository,
    warehouseRepository
);

// 替換占位符
export const warehouseService = warehouseApplicationService;
export const warehouseItemService = warehouseItemApplicationService;

// 匯出所有服務類型
export * from './warehouse-item-service';
export * from './warehouse-service';

