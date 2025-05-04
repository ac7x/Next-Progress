import { WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { IWarehouseItemDomainService, WarehouseItemDomainService } from '@/modules/c-stock/domain/warehouse-item-service';
import { warehouseItemRepository } from '@/modules/c-stock/infrastructure/warehouse-item-repository';

const domainService: IWarehouseItemDomainService = new WarehouseItemDomainService(warehouseItemRepository);

export async function queryAllWarehouseItems(): Promise<WarehouseItem[]> {
    return domainService.getAllWarehouseItems();
}

export async function queryWarehouseItemsByWarehouse(id: string): Promise<WarehouseItem[]> {
    return domainService.getWarehouseItemsByWarehouse(id);
}

export async function queryWarehouseItemById(id: string): Promise<WarehouseItem | null> {
    return domainService.getWarehouseItemById(id);
}
