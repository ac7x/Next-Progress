import { warehouseItemRepository } from '@/modules/c-stock/infrastructure/warehouse-item-repository';
import { warehouseInstanceRepository } from '@/modules/c-stock/infrastructure/warehouse-repository';
import { WarehouseApplicationService } from './warehouse-service';
import { WarehouseItemApplicationService } from './warehouse-item-service';

// 創建應用服務實例
export const warehouseService = new WarehouseApplicationService(warehouseInstanceRepository);
export const warehouseItemService = new WarehouseItemApplicationService(warehouseItemRepository, warehouseInstanceRepository);

// 匯出服務類
export { WarehouseApplicationService, WarehouseItemApplicationService };