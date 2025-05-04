'use server';

import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '@/modules/c-stock/domain/warehouse-entity';
import { revalidatePath } from 'next/cache';
import { warehouseService } from './warehouse-service';

export async function getAllWarehouses(): Promise<Warehouse[]> {
  try {
    return await warehouseService.getAllWarehouses();
  } catch (error) {
    console.error('獲取倉庫列表失敗:', error);
    return [];
  }
}

export async function getWarehouseById(id: string): Promise<Warehouse | null> {
  try {
    return await warehouseService.getWarehouseById(id);
  } catch (error) {
    console.error('獲取倉庫詳情失敗:', error);
    return null;
  }
}

export async function createWarehouse(data: CreateWarehouseProps): Promise<Warehouse | null> {
  try {
    const warehouse = await warehouseService.createWarehouse(data);

    // 確保倉庫頁面即時更新
    revalidatePath('/client/warehouse');

    return warehouse;
  } catch (error) {
    console.error('建立倉庫失敗:', error);
    throw error instanceof Error ? error : new Error('建立倉庫失敗');
  }
}

export async function updateWarehouse(id: string, data: UpdateWarehouseProps): Promise<Warehouse | null> {
  try {
    const warehouse = await warehouseService.updateWarehouse(id, data);

    // 確保倉庫頁面即時更新
    revalidatePath('/client/warehouse');

    return warehouse;
  } catch (error) {
    console.error('更新倉庫失敗:', error);
    throw error instanceof Error ? error : new Error('更新倉庫失敗');
  }
}

export async function deleteWarehouse(id: string): Promise<void> {
  try {
    await warehouseService.deleteWarehouse(id);

    // 確保倉庫頁面即時更新
    revalidatePath('/client/warehouse');
  } catch (error) {
    console.error('刪除倉庫失敗:', error);
    throw error instanceof Error ? error : new Error('刪除倉庫失敗');
  }
}
