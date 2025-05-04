import { IWarehouseItemDomainService, WarehouseItemDomainService } from '@/modules/c-stock/domain/warehouse-item-service';
import { warehouseItemRepository } from '@/modules/c-stock/infrastructure/warehouse-item-repository';

const domainService: IWarehouseItemDomainService = new WarehouseItemDomainService(warehouseItemRepository);

export async function getAllWarehouseItems() {
    return domainService.getAllWarehouseItems();
}

export async function getWarehouseItemsByWarehouse(warehouseId: string) {
    return domainService.getWarehouseItemsByWarehouse(warehouseId);
}

export async function getWarehouseItemById(id: string) {
    return domainService.getWarehouseItemById(id);
}
