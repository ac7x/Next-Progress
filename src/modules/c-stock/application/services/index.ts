import { warehouseItemRepository } from '@/modules/c-stock/infrastructure/repositories/warehouse-item-repository';
import { warehouseInstanceRepository } from '@/modules/c-stock/infrastructure/repositories/warehouse-repository';
import { WarehouseItemApplicationService } from './warehouse-item-service';
import { WarehouseApplicationService } from './warehouse-service';

// 創建應用服務實例
export const warehouseService = new WarehouseApplicationService(warehouseInstanceRepository);
export const warehouseItemService = new WarehouseItemApplicationService(warehouseItemRepository, warehouseInstanceRepository);

// 匯出服務類
export { WarehouseApplicationService, WarehouseItemApplicationService };

