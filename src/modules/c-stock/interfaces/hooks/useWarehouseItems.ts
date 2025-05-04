import { getWarehouseItemsByWarehouse } from '@/modules/c-stock/application/warehouseItem.query';
import { WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { useQuery } from '@tanstack/react-query';

export function useWarehouseItems(warehouseId: string) {
  return useQuery<WarehouseItem[], Error>({
    queryKey: ['warehouseItems', warehouseId],
    queryFn: () => getWarehouseItemsByWarehouse(warehouseId)
  });
}
