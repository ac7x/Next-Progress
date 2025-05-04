'use server';

import { WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { warehouseInstanceService } from './warehouse-service';

export async function getAllWarehouseInstances(): Promise<WarehouseInstance[]> {
    return warehouseInstanceService.getAllWarehouseInstances();
}

export async function getWarehouseInstanceById(id: string): Promise<WarehouseInstance | null> {
    return warehouseInstanceService.getWarehouseInstanceById(id);
}
